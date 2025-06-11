import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModalComponent } from '@app/features/main/ui/components/common-modal/common-modal.component';
import { GameService } from '@app/features/game/services/game-service/game-service.service';
import { GameState, Inventory } from '@app/features/main/interfaces/types';
import { itemDefinitions } from '@content/item-definitions';
import { IconButtonComponent } from '@app/features/main/ui/components/icons/icon-button/icon-button.component';

@Component({
  selector: 'app-modal-inventory',
  standalone: true,
  imports: [CommonModalComponent, IconButtonComponent],
  templateUrl: './modal-inventory.component.html',
  styleUrl: './modal-inventory.component.css',
})
export class ModalInventoryComponent {
  constructor(private _gameService: GameService) {}

  private subscriptions: Subscription[] = [];
  currentInventory: Inventory | null = null;
  currentInventoryKeys: string[] = [];
  itemDefinitions = itemDefinitions;
  canDrop = false;

  handleInventoryClose = () => {
    this._gameService.setPageModalStatus('');
  };

  ngOnInit(): void {
    this.subscriptions.push(
      this._gameService.gameStateObs.subscribe((data: GameState | null) => {
        if (!data) {
          return;
        }
        if (
          data?.player.inventory &&
          JSON.stringify(data.player.inventory) !==
            JSON.stringify(this.currentInventory)
        ) {
          this.currentInventoryKeys = Object.keys(data.player.inventory);
          this.currentInventory = data.player.inventory;
        }
        const positionKey = `${data?.player.y}_${data?.player.x}`;
        const area = data.areas[data?.player.areaId];
        const isSpaceOccupied = area.items.some(
          (item) => `${item.y}_${item.x}` === positionKey
        );
        this.canDrop = !isSpaceOccupied;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  handleItemActionClick(itemId: string, action: string) {
    if (action === 'drop' && this.canDrop) {
      this._gameService.processTurn({ verb: 'item-drop', noun: itemId });
    }
  }
}
