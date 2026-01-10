import { Component, HostListener } from '@angular/core';
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
import { GameEndMessageComponent } from '../../components/game-end-message/game-end-message.component';
import { ModalInventoryComponent } from '../../components/modal-inventory/modal-inventory.component';
import { LoaderAnimationComponent } from '@app/features/main/ui/components/loader-animation/loader-animation.component';
import { TooltipComponent } from '@app/features/main/ui/components/tooltip/tooltip.component';
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
    GameEndMessageComponent,
    LoaderAnimationComponent,
    TooltipComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  private windowWidth: number;
  private windowHeight: number;

  public isFullWidthMode: boolean = false;
  public isLoading: boolean = false;
  public gameStatus: string = '';
  public gameAuthorId: string = '';
  public gameModalStatus: string = 'loading';
  public pageModalTitle: string = 'Loading';
  public isLockedOut: boolean = false;
  public showInventoryDot: boolean = false;
  public previousInventory: Inventory | null = null;
  private userId: string | null = null;
  public numTurns: number = 0;
  public showIntroduction: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _gameService: GameService,
    private _authGoogleService: AuthProviderService,
    private router: Router
  ) {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this._gameService.setAspectRatio(this.windowWidth / this.windowHeight);
  }

  private subscriptions: Subscription[] = [];
  // Eventually we will pull this in dynamically
  title: string = '';
  introParagraphs: Paragraph[] = [];

  private authorizationCheck() {
    if (this.title !== '' && this.userId !== null) {
      const v = this._route.snapshot.queryParamMap.get('v');
      if (
        (this.gameStatus !== 'active' || !!v) &&
        this.gameAuthorId !== this.userId
      ) {
        logger({
          message: 'Unauthorized access to game data',
          type: 'error',
        });
        this.router.navigate(['/']);
      }
    }
  }

  ngOnInit(): void {
    const v = this._route.snapshot.queryParamMap.get('v');
    const id = this._route.snapshot.paramMap.get('id');
    this._gameService.setPageModalStatus('loading');
    this._gameService.loadGameROM(id, v);
    this.isLoading = true;
    this.subscriptions.push(
      this._authGoogleService.isLoggedInObs.subscribe(isLoggedIn => {
        if (isLoggedIn === null) {
          return;
        }
        this.userId = isLoggedIn ? this._authGoogleService.getUserId() : '';
        this.authorizationCheck();
      })
    );
    this.subscriptions.push(
      this._gameService.gameROMObs.subscribe((data: GameROM | null) => {
        if (data) {
          this.title = `Teeny Quest: ${data.title}`;
          this.showIntroduction =
            typeof data.introduction !== 'undefined' &&
            data.introduction !== '';
          this.introParagraphs =
            this.showIntroduction && data.introduction
              ? data.introduction
                  .split('\n')
                  .map((p, idx) => ({ text: p, id: idx }))
              : [];
          this.gameStatus = data.itemStatus;
          this.gameAuthorId = data.userId;
          this.isLoading = false;
          const nextPageModalStatus = this.showIntroduction ? 'intro' : '';
          this._gameService.setPageModalStatus(nextPageModalStatus);
          this.authorizationCheck();
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
        if (data) {
          this.numTurns = data.numTurns;
        }

        if (data?.flagValues['gameEnded']) {
          // FUTURE: handle game end vs level end
          // -- For now, we just game end and go back to the homepage
          this.gameStatus = 'ended';
          this._gameService.resetGameProgress();
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

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.windowWidth = (event.target as Window).innerWidth;
    this.windowHeight = (event.target as Window).innerHeight;
    const aspectRatio = this.windowWidth / this.windowHeight;
    if (aspectRatio < 1 && this.isFullWidthMode) {
      this.isFullWidthMode = false;
    }
    this._gameService.setAspectRatio(aspectRatio);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
  handleGameEndClick = () => {
    this.router.navigate(['/']);
  };
  handleToggleFullWidth = () => {
    this.isFullWidthMode = !this.isFullWidthMode;
    this._gameService.setFullWidthYOffsetCurrent();
  };
  handleResetProgress = () => {
    this._gameService.resetGameProgress();
    window.location.reload();
  };
}
