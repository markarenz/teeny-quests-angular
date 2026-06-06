import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModalComponent } from '@app/features/main/ui/components/common-modal/common-modal.component';
import { ButtonToggleComponent } from '@app/features/main/ui/components/button-toggle/button-toggle.component';
import { ShopInventoryCardComponent } from './shop-inventory-card/shop-inventory-card.component';
import { GameService } from '@app/features/game/services/game-service/game-service.service';
import {
  ActorShopInventoryItem,
  Inventory,
} from '@app/features/main/interfaces/types';
import { inventoryDefinitions } from '@content/item-definitions';

@Component({
  selector: 'app-modal-shop',
  imports: [
    CommonModalComponent,
    ButtonToggleComponent,
    ShopInventoryCardComponent,
  ],
  templateUrl: './modal-shop.component.html',
  styleUrl: './modal-shop.component.css',
})
export class ModalShopComponent {
  private subscriptions: Subscription[] = [];
  @Input() playerInventory: Inventory = {};
  constructor(private _gameService: GameService) {}

  public mode: 'buy' | 'sell' = 'buy';
  public shopInventory: ActorShopInventoryItem[] = [];
  public playerInventoryKeys: string[] = [];
  public playerFunds: number = 0;
  public inventoryDefinitions = inventoryDefinitions;

  public refreshUi() {
    const shopInventoryKeys = this.shopInventory.map(
      item => item.inventoryItemId
    );
    this.playerInventoryKeys = Object.keys(this.playerInventory).filter(
      key =>
        this.playerInventory[key] > 0 &&
        key !== 'gold' &&
        shopInventoryKeys.includes(key)
    );
    this.playerFunds = this.playerInventory['gold'] || 0;
  }
  ngOnChanges() {
    this.refreshUi();
  }
  ngOnInit() {
    this.subscriptions.push(
      this._gameService.shopInventoryObs.subscribe(data => {
        this.shopInventory = data;
        this.refreshUi();
      })
    );
  }

  public handleShopAction(
    itemKey: string,
    price: number,
    actionType: 'buy' | 'sell'
  ) {
    this._gameService.processShopAction(itemKey, price, actionType);
  }

  public handleCloseShop() {
    this._gameService.processShopAction('', 0, 'end');
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
