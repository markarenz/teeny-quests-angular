import { Component, Input } from '@angular/core';
import { Inventory } from '@app/features/main/interfaces/types';
import { AreaItemComponent } from '../../area-item/area-item.component';
import { IconButtonComponent } from '@app/features/main/ui/components/icons/icon-button/icon-button.component';
import { GameService } from '@app/features/game/services/game-service/game-service.service';
import {
  inventoryDefinitions,
  itemDefinitions,
} from '@content/item-definitions';

enum UIMode {
  default = 'default',
  info = 'info',
}

@Component({
  selector: 'app-inventory-item-card',
  standalone: true,
  imports: [AreaItemComponent, IconButtonComponent],
  templateUrl: './inventory-item-card.component.html',
  styleUrl: './inventory-item-card.component.css',
})
export class InventoryItemCardComponent {
  constructor(private _gameService: GameService) {}
  @Input('key') key: string = '';
  @Input('currentInventory') currentInventory: Inventory | null = null;
  @Input('canDrop') canDrop: boolean = false;

  public uiMode: UIMode = UIMode.default;
  public itemDefinitions = itemDefinitions;
  public inventoryDefinitions = inventoryDefinitions;

  getCanUseItem(): boolean {
    return this._gameService.getCanUseItem(this.key);
  }

  handleItemActionClick(action: string) {
    if (action === 'drop' && this.canDrop) {
      this._gameService.processTurn({ verb: 'item-drop', noun: this.key });
    }
    if (action === 'use') {
      this._gameService.processTurn({ verb: 'item-use', noun: this.key });
    }
    if (action === 'info') {
      if (this.uiMode === UIMode.info) {
        this.uiMode = UIMode.default;
      } else {
        this.uiMode = UIMode.info;
      }
    }
  }
}
