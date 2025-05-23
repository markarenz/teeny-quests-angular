import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { GameService } from '@app/features/game/services/game-service/game-service.service';
import { MainLayoutComponent } from '@main/ui/components/main-layout/main-layout.component';
import { GameROM, Paragraph } from '@app/features/main/interfaces/types';
import { GameAreaComponent } from '../../components/game-area/game-area.component';
import { pageModalTitles } from '@content/constants';
import { IconButtonComponent } from '@app/features/main/ui/components/icons/icon-button/icon-button.component';
import { ModalPageComponent } from '@app/features/game/ui/components/modal-page/modal-page.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    MainLayoutComponent,
    GameAreaComponent,
    IconButtonComponent,
    ModalPageComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  isLoading: boolean = false;
  pageModalStatus: string = 'loading';
  pageModalTitle: string = 'Loading';
  isLockedOut: boolean = false;
  constructor(
    private titleService: Title,
    private metaService: Meta,
    private _route: ActivatedRoute,
    private _gameService: GameService
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
      this._gameService.pageModalStatusObs.subscribe((data: string) => {
        this.pageModalStatus = `${data}`;
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
}
