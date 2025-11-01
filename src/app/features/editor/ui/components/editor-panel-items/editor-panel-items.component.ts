import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { FormsModule } from '@angular/forms';
import {
  GameArea,
  GameAreaExit,
  GameItem,
  GameProp,
  SelectIUIOption,
} from '@app/features/main/interfaces/types';
import { AreaCellSelectorComponent } from '../area-cell-selector/area-cell-selector.component';
import { CollapsibleCardComponent } from '@app/features/main/ui/components/collapsible-card/collapsible-card.component';
import { itemOptions } from '@content/item-definitions';
import { IconButtonComponent } from '@app/features/main/ui/components/icons/icon-button/icon-button.component';
import { getPositionKeysForGridSize } from '@main/utils';
import { floorDefinitions } from '@content/floor-definitions';

@Component({
  selector: 'app-editor-panel-items',
  standalone: true,
  imports: [
    FormsModule,
    CollapsibleCardComponent,
    AreaCellSelectorComponent,
    IconButtonComponent,
  ],
  templateUrl: './editor-panel-items.component.html',
  styleUrl: './editor-panel-items.component.css',
})
export class EditorPanelItemsComponent {
  constructor(private _gameEditorService: GameEditorService) {}
  private subscriptions: Subscription[] = [];

  selectedAreaId: string = '';
  panelMode: string = '';
  itemTypeOptions: SelectIUIOption[] = itemOptions;
  inputItemType: string = '';
  inputItemPosition: string = '';
  selectedItemId: string = '';
  items: GameItem[] = [];
  isSelectedPositionValid: boolean = false;
  lockouts: string[] = [];
  area: GameArea | null = null;

  updateItemPositionLockouts() {
    if (this.area) {
      const newLockouts: string[] = [];
      this.area.items.forEach((item: GameItem) => {
        if (item.id !== this.selectedItemId) {
          newLockouts.push(`${item.y}_${item.x}`);
        }
      });
      this.area.exits.forEach((exit: GameAreaExit) => {
        newLockouts.push(`${exit.y}_${exit.x}`);
      });
      this.area.props.forEach((prop: GameProp) => {
        newLockouts.push(`${prop.y}_${prop.x}`);
      });
      const positionKeys = getPositionKeysForGridSize();
      const map = this.area.map;
      positionKeys.forEach((position: string) => {
        const floor = floorDefinitions[map[position].floor];
        if (
          (!floor.walkable || map[position].isHidden) &&
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
        this.updateUiAfterExitSelection(data);
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
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  handleDeleteClick(id: string) {
    this._gameEditorService.deleteItem(id);
    this.updateItemPositionLockouts();
  }

  updateUiAfterExitSelection(id: string) {
    const selectedItem = this.items.find(item => item.id === id);
    this.inputItemPosition = selectedItem
      ? `${selectedItem.y}_${selectedItem.x}`
      : '';
    this.inputItemType = selectedItem ? selectedItem.itemType : '';
    this.updateItemPositionLockouts();
  }

  handleEditClick(id: string) {
    if (this.selectedItemId === id) {
      this._gameEditorService.selectItem('');
      this.selectedItemId = '';
      return;
    }
    this._gameEditorService.selectItem(id);
    this.updateUiAfterExitSelection(id);
  }

  handlePositionSelect(position: string) {
    this.inputItemPosition = position;
    this.handleItemInputChange();
  }

  handleCreateClick() {
    const item: GameItem | null = this._gameEditorService.createItem(
      this.lockouts
    );
    if (item) {
      this.handleEditClick(item.id);
      this.updateItemPositionLockouts();
    }
  }

  handleItemInputChange() {
    const selectedItem = this.items.find(
      item => item.id === this.selectedItemId
    );
    const [y, x] = this.inputItemPosition.split('_');
    if (selectedItem) {
      const updatedItem: GameItem = {
        ...selectedItem,
        id: this.selectedItemId,
        itemType: this.inputItemType,
        areaId: this.selectedAreaId,
        x: +x,
        y: +y,
      };
      this._gameEditorService.updateItem(updatedItem);
      this.updateItemPositionLockouts();
    }
  }
}
