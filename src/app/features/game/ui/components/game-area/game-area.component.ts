import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from '@app/features/game/services/game-service/game-service.service';
import { GameArea, GameROM } from '@app/features/main/interfaces/types';

@Component({
  selector: 'app-game-area',
  standalone: true,
  imports: [],
  templateUrl: './game-area.component.html',
  styleUrl: './game-area.component.css',
})
export class GameAreaComponent {
  area: GameArea | null = null;
  // subscribe to currentArea

  private subscriptions: Subscription[] = [];
  constructor(private _gameService: GameService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this._gameService.gameROMObs.subscribe((data: GameROM | null) => {
        if (data) {
          // this.title = data.title;
          // this.description = data.description;
          // this.isLoading = false;
          // GameROM, areas contain the items
          // Do we need to abstract the items into the gameState?
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
