import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { GameService } from '@app/features/game/services/game-service/game-service.service';
import { ContainerComponent } from '@main/ui/components/container/container.component';
import { MainLayoutComponent } from '@main/ui/components/main-layout/main-layout.component';
import { GameROM } from '@app/features/main/interfaces/types';
import { SkeletonTextComponent } from '@app/features/main/ui/components/skeleton-text/skeleton-text.component';
import { GameAreaComponent } from '../../components/game-area/game-area.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    ContainerComponent,
    MainLayoutComponent,
    SkeletonTextComponent,
    GameAreaComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  isLoading: boolean = false;
  constructor(
    private titleService: Title,
    private metaService: Meta,
    private _route: ActivatedRoute,
    private _gameService: GameService
  ) {}

  private subscriptions: Subscription[] = [];
  // Eventually we will pull this in dynamically
  title = '';
  description = '';

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    this._gameService.loadGameROM(id);
    this.isLoading = true;
    this.subscriptions.push(
      this._gameService.gameROMObs.subscribe((data: GameROM | null) => {
        if (data) {
          this.title = data.title;
          this.description = data.description;
          this.isLoading = false;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
