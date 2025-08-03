import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '@app/features/game/services/game-service/game-service.service';
import { MainLayoutComponent } from '@main/ui/components/main-layout/main-layout.component';
import {
  GameROM,
  GameState,
  Inventory,
  Paragraph,
} from '@app/features/main/interfaces/types';
import { GameAreaComponent } from '../../components/game-area/game-area.component';
import { pageModalTitles } from '@content/constants';
import { IconButtonComponent } from '@app/features/main/ui/components/icons/icon-button/icon-button.component';
import { ModalPageComponent } from '@app/features/game/ui/components/modal-page/modal-page.component';
import { ModalInventoryComponent } from '../../components/modal-inventory/modal-inventory.component';
import { AuthProviderService } from '@app/features/auth/services/auth-provider-service';
import { logger } from '@app/features/main/utils/logger';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    MainLayoutComponent,
    GameAreaComponent,
    IconButtonComponent,
    ModalPageComponent,
    ModalInventoryComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  isLoading: boolean = false;
  gameModalStatus: string = 'loading';
  pageModalTitle: string = 'Loading';
  isLockedOut: boolean = false;
  showInventoryDot: boolean = false;
  previousInventory: Inventory | null = null;
  constructor(
    private _route: ActivatedRoute,
    private _gameService: GameService,
    private _authGoogleService: AuthProviderService,
    private router: Router
  ) {}

  private subscriptions: Subscription[] = [];
  // Eventually we will pull this in dynamically
  title: string = '';
  introParagraphs: Paragraph[] = [];

  ngOnInit(): void {
    this._gameService.setPageModalStatus('loading');
    const id = this._route.snapshot.paramMap.get('id');
    this._gameService.loadGameROM(id);
    this.isLoading = true;
    this.subscriptions.push(
      this._gameService.gameROMObs.subscribe((data: GameROM | null) => {
        if (data) {
          const userId = this._authGoogleService.getUserId();
          if (
            // TODO: use enum for itemStatus
            data.itemStatus !== 'active' &&
            data &&
            data.userId !== userId
          ) {
            logger({
              message: 'Unauthorized access to game data',
              type: 'error',
            });
            this.router.navigate(['/']);
            return;
          }

          this.title = data.title;
          this.introParagraphs = data.introduction
            .split('\n')
            .map((p, idx) => ({ text: p, id: idx }));
          this.isLoading = false;
          this._gameService.setPageModalStatus('intro');
        }
      })
    );
    this.subscriptions.push(
      this._gameService.gameStateObs.subscribe((data: GameState | null) => {
        if (
          data?.player.inventory &&
          JSON.stringify(data.player.inventory) !==
            JSON.stringify(this.previousInventory)
        ) {
          if (this.previousInventory !== null) {
            this.showInventoryDot = true;
          }
          this.previousInventory = data.player.inventory;
        }
      })
    );
    this.subscriptions.push(
      this._gameService.pageModalStatusObs.subscribe((data: string) => {
        this.gameModalStatus = `${data}`;
        this.pageModalTitle = pageModalTitles[data];
      })
    );
    this.subscriptions.push(
      this._gameService.isLockedOutObs.subscribe((data: boolean) => {
        this.isLockedOut = data;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  handlePageModalConfirm = () => {
    this._gameService.setPageModalStatus('');
  };

  handleHelpClick = () => {
    this._gameService.setPageModalStatus('help');
  };
  handleInfoClick = () => {
    this._gameService.setPageModalStatus('intro');
  };
  handleInventoryClick = () => {
    this._gameService.setPageModalStatus('inventory');
    this.showInventoryDot = false;
  };
  handleInventoryClose = () => {
    this._gameService.setPageModalStatus('');
  };
}
