import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameEditorServiceService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { FormsModule } from '@angular/forms';
import { GameItem, SelectIUIOption } from '@app/features/main/interfaces/types';
import { AreaCellSelectorComponent } from '../area-cell-selector/area-cell-selector.component';
import { CollapsibleCardComponent } from '@app/features/main/ui/components/collapsible-card/collapsible-card.component';
import { ButtonComponent } from '@app/features/main/ui/components/button/button.component';
import { itemOptions } from '@content/item-definitions';
import { IconButtonComponent } from '@app/features/main/ui/components/icon-button/icon-button.component';

@Component({
  selector: 'app-editor-panel-items',
  standalone: true,
  imports: [
    FormsModule,
    ButtonComponent,
    CollapsibleCardComponent,
    AreaCellSelectorComponent,
    IconButtonComponent,
  ],
  templateUrl: './editor-panel-items.component.html',
  styleUrl: './editor-panel-items.component.css',
})
export class EditorPanelItemsComponent {
  constructor(private _gameEditorService: GameEditorServiceService) {}
  private subscriptions: Subscription[] = [];

  selectedAreaId: string = '';
  panelMode: string = '';
  itemTypeOptions: SelectIUIOption[] = itemOptions;
  inputItemType: string = '';
  inputItemPosition: string = '';
  selectedItemId: string = '';
  items: GameItem[] = [];
  isSelectedPositionValid: boolean = false;

  ngOnInit() {
    this.subscriptions.push(
      this._gameEditorService.selectedExitIdObs.subscribe((data: string) => {
        this.selectedItemId = data;
        this.items = this._gameEditorService.getItemsForCurrentArea();
      })
    );
    this.subscriptions.push(
      this._gameEditorService.selectedAreaIdObs.subscribe((data: any) => {
        this.selectedAreaId = data;
        this.items = this._gameEditorService.getItemsForCurrentArea();
        this.selectedItemId = '';
      })
    );
    this.subscriptions.push(
      this._gameEditorService.gameObs.subscribe((_data: any) => {
        this.items = this._gameEditorService.getItemsForCurrentArea();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  handleDeleteClick(id: string) {
    this._gameEditorService.deleteItem(id);
  }

  handleEditClick(id: string) {
    this.selectedItemId = id;
    const selectedItem = this.items.find((item) => item.id === id);
    this.inputItemPosition = selectedItem
      ? `${selectedItem.y}_${selectedItem.x}`
      : '';
    this.inputItemType = selectedItem ? selectedItem.itemType : '';
  }

  handlePositionSelect(position: string) {
    this.inputItemPosition = position;
    this.handleItemInputChange();
  }

  handleCreateClick() {
    const item: GameItem | null = this._gameEditorService.createItem();
    if (item) {
      this.handleEditClick(item.id);
    }
  }

  handleItemInputChange() {
    const selectedItem = this.items.find(
      (item) => item.id === this.selectedItemId
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
    }
  }
}
