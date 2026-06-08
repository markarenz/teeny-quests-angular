import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { FormsModule } from '@angular/forms';
import {
  QuestActor,
  QuestArea,
  QuestAreaExit,
  QuestItem,
  QuestProp,
  SelectUIOption,
} from '@app/features/main/interfaces/types';
import { AreaCellSelectorComponent } from '../area-cell-selector/area-cell-selector.component';
import { CollapsibleCardComponent } from '@app/features/main/ui/components/collapsible-card/collapsible-card.component';
import { itemOptions } from '@content/item-definitions';
import { IconButtonComponent } from '@app/features/main/ui/components/icons/icon-button/icon-button.component';
import { getPositionKeysForGridSize } from '@main/utils';
import { floorDefinitions } from '@content/floor-definitions';

@Component({
  selector: 'app-editor-panel-items',
  imports: [
    FormsModule,
    CollapsibleCardComponent,
    AreaCellSelectorComponent,
    IconButtonComponent,
  ],
  templateUrl: './editor-panel-items.component.html',
  styleUrl: './editor-panel-items.component.css',
  standalone: true,
})
export class EditorPanelItemsComponent {
  constructor(private _gameEditorService: GameEditorService) {}
  private subscriptions: Subscription[] = [];

  public selectedAreaId: string = '';
  public panelMode: string = '';
  public itemTypeOptions: SelectUIOption[] = itemOptions;
  public inputItemType: string = '';
  public inputItemPosition: string = '';
  public inputItemName: string = '';
  public selectedItemId: string = '';
  public items: QuestItem[] = [];
  public isSelectedPositionValid: boolean = false;
  public lockouts: string[] = [];
  public area: QuestArea | null = null;
  public totalGold: number = 0;

  private refreshUIData() {
    this.totalGold = this._gameEditorService.getItemReport();
    this.items = this._gameEditorService.getItemsForCurrentArea();
    this.updateItemPositionLockouts();
  }
  updateItemPositionLockouts() {
    if (this.area) {
      const newLockouts: string[] = [];
      this.items.forEach((item: QuestItem) => {
        if (item.id !== this.selectedItemId) {
          newLockouts.push(`${item.y}_${item.x}`);
        }
      });
      this.area.actors.forEach((actor: QuestActor) => {
        newLockouts.push(`${actor.y}_${actor.x}`);
      });
      const positionKeys = getPositionKeysForGridSize();
      const map = this.area.map;
      positionKeys.forEach((position: string) => {
        const floor = floorDefinitions[map[position].floor];
        if (
          (!floor.walkable ||
            map[position].isHidden ||
            map[position].h === 0) &&
          !newLockouts.includes(position)
        ) {
          newLockouts.push(position);
        }
      });
      this.lockouts = newLockouts;
    }
  }
  ngOnInit() {
    this.subscriptions.push(
      this._gameEditorService.selectedItemIdObs.subscribe((data: string) => {
        this.selectedItemId = data;
        this.items = this._gameEditorService.getItemsForCurrentArea();
        this.updateUiAfterItemSelection(data);
      })
    );
    this.subscriptions.push(
      this._gameEditorService.selectedAreaIdObs.subscribe((data: any) => {
        this.selectedAreaId = data;
        this.items = this._gameEditorService.getItemsForCurrentArea();
        this.area = this._gameEditorService.getAreaById(this.selectedAreaId);
        this.updateItemPositionLockouts();
      })
    );
    this.subscriptions.push(
      this._gameEditorService.gameObs.subscribe((data: any) => {
        this.refreshUIData();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  handleDeleteClick(id: string) {
    this._gameEditorService.deleteItem(id);
    this.refreshUIData();
  }

  updateUiAfterItemSelection(id: string) {
    const selectedItem = this.items.find(item => item.id === id);
    this.inputItemName = selectedItem ? selectedItem.name || '' : '';
    this.inputItemPosition = selectedItem
      ? `${selectedItem.y}_${selectedItem.x}`
      : '';
    this.inputItemType = selectedItem ? selectedItem.itemType : '';
    this.refreshUIData();
  }

  handleEditClick(id: string) {
    if (this.selectedItemId === id) {
      this._gameEditorService.selectItem('');
      this.selectedItemId = '';
      return;
    }
    this._gameEditorService.selectItem(id);
    this.updateUiAfterItemSelection(id);
  }

  handlePositionSelect(position: string) {
    this.inputItemPosition = position;
    this.handleItemInputChange();
  }

  handleCreateClick() {
    const item: QuestItem | null = this._gameEditorService.createItem(
      this.lockouts
    );
    if (item) {
      this.handleEditClick(item.id);
      this.refreshUIData();
    }
  }

  handleItemInputChange() {
    const selectedItem = this.items.find(
      item => item.id === this.selectedItemId
    );
    const [y, x] = this.inputItemPosition.split('_');
    if (selectedItem) {
      const updatedItem: QuestItem = {
        ...selectedItem,
        id: this.selectedItemId,
        name: this.inputItemName,
        itemType: this.inputItemType,
        areaId: this.selectedAreaId,
        x: +x,
        y: +y,
      };
      this._gameEditorService.updateItem(updatedItem);
      this.refreshUIData();
    }
  }
}
