import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import {
  GameROM,
  Inventory,
  SelectIUIOption,
} from '@app/features/main/interfaces/types';
import {
  inventoryDefinitions,
  itemDefinitions,
} from '@content/item-definitions';
import { IconButtonComponent } from '@app/features/main/ui/components/icons/icon-button/icon-button.component';

@Component({
  selector: 'app-editor-inventory',
  standalone: true,
  imports: [FormsModule, IconButtonComponent],
  templateUrl: './editor-inventory.component.html',
  styleUrl: './editor-inventory.component.css',
})
export class EditorInventoryComponent {
  constructor(private _gameEditorService: GameEditorService) {}
  private subscriptions: Subscription[] = [];
  inputAddItemId: string = '';
  inventory: Inventory = {};
  inventoryKeys: string[] = Object.keys(this.inventory);
  itemDefinitions = itemDefinitions;
  inventoryDefinitions = inventoryDefinitions;
  itemOptions: SelectIUIOption[] = [];

  updateInventoryKeys() {
    this.inventoryKeys = Object.keys(this.inventory);
    const inventoryItemKeys = Object.keys(inventoryDefinitions);
    this.itemOptions = inventoryItemKeys
      .filter((key) => !this.inventoryKeys.includes(key))
      .map((key) => ({
        value: key,
        label: this.inventoryDefinitions[key].name,
      }));
  }

  ngOnInit() {
    this.subscriptions.push(
      this._gameEditorService.gameObs.subscribe((data: GameROM | null) => {
        if (data) {
          this.inventory = data.content.player.inventory;
          this.updateInventoryKeys();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  handleDeleteInventoryItem(itemId: string) {
    const newInventory = JSON.parse(JSON.stringify(this.inventory));
    delete newInventory[itemId];
    this.updateInventory(newInventory);
  }

  updateInventory(newInventory: Inventory) {
    this._gameEditorService.updateStarterInventory(newInventory);
  }

  handleQtyInputChange() {
    const newInventory = JSON.parse(JSON.stringify(this.inventory));
    this.updateInventory(newInventory);
  }

  handleAddInventoryItem() {
    const newInventory = JSON.parse(JSON.stringify(this.inventory));
    newInventory[this.inputAddItemId] = 0;
    this.updateInventory(newInventory);
  }
}
