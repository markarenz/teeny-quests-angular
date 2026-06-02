import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AreaItemComponent } from '../../area-item/area-item.component';
import { ButtonComponent } from '@app/features/main/ui/components/button/button.component';

import {
  Inventory,
  ShopTransaction,
} from '@app/features/main/interfaces/types';
import {
  inventoryDefinitions,
  itemDefinitions,
} from '@content/item-definitions';

@Component({
  selector: 'app-shop-inventory-card',
  imports: [AreaItemComponent, ButtonComponent],
  templateUrl: './shop-inventory-card.component.html',
  styleUrl: './shop-inventory-card.component.css',
})
export class ShopInventoryCardComponent {
  @Input('key') key: string = '';
  @Input('transactionMode') transactionMode: 'buy' | 'sell' = 'buy';
  @Input('playerFunds') playerFunds: number = 0;
  @Input('playerInventory') playerInventory: Inventory = {};
  @Output() onTransaction = new EventEmitter<ShopTransaction>();

  public itemDefinitions = itemDefinitions;
  public inventoryDefinitions = inventoryDefinitions;

  public handleTransaction(itemKey: string, actionType: 'buy' | 'sell') {
    this.onTransaction.emit({ itemKey, actionType });
  }
}
