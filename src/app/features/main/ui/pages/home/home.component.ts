import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ContainerComponent } from '@main/ui/components/container/container.component';
import { MainLayoutComponent } from '@main/ui/components/main-layout/main-layout.component';
import { LogoMainComponent } from '../../components/logo-main/logo-main.component';
import { GameLinkCardComponent } from '../../components/game-link-card/game-link-card.component';
import { MainAppService } from '@app/features/main/services/main-app-service';
import { GameROM } from '@app/features/main/interfaces/types';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ContainerComponent,
    MainLayoutComponent,
    RouterLink,
    LogoMainComponent,
    GameLinkCardComponent,
  ],

  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private _mainAppService: MainAppService) {}
  private subscriptions: Subscription[] = [];

  games: any[] = [];
  isLoading: boolean = true;
  skeletons: number[] = Array.from({ length: 4 }, (_, i) => i);

  title = 'Welcome to Teeny Quests';
  description =
    'Embark on a journey of miniscule proportions, and even make your own game for friends to play.';

  ngOnInit(): void {
    this._mainAppService.getGamesList();

    this.subscriptions.push(
      this._mainAppService.isLoadingObs.subscribe((data: boolean) => {
        this.isLoading = data;
      })
    );
    this.subscriptions.push(
      this._mainAppService.gamesObs.subscribe((data: GameROM[]) => {
        this.games = data;
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
