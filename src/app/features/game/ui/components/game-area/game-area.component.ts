import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from '@app/features/game/services/game-service/game-service.service';
import {
  GameArea,
  GameAreaExit,
  GameAreaMap,
  GameItem,
  GameState,
  MovementOptions,
} from '@app/features/main/interfaces/types';
import { AreaCellComponent } from '@app/features/game/ui/components/area-cell/area-cell.component';
import { AreaExitComponent } from '@app/features/game/ui/components/area-exit/area-exit.component';
import { AreaItemComponent } from '@app/features/game/ui/components/area-item/area-item.component';
import { GamePlayerComponent } from '../game-player/game-player.component';
import { GameMovementOptionButtonComponent } from '../game-movement-option-button/game-movement-option-button.component';

@Component({
  selector: 'app-game-area',
  standalone: true,
  imports: [
    AreaCellComponent,
    AreaExitComponent,
    AreaItemComponent,
    GameMovementOptionButtonComponent,
    GamePlayerComponent,
  ],
  templateUrl: './game-area.component.html',
  styleUrl: './game-area.component.css',
})
export class GameAreaComponent {
  private subscriptions: Subscription[] = [];
  constructor(private _gameService: GameService) {}

  areaId: string | null = null;
  areaMap: GameAreaMap | null = null;
  areaExits: GameAreaExit[] = [];
  areaItems: GameItem[] = [];
  movementOptions: { [key: string]: string[] } = {};
  movementOptionsKeys: string[] = [];
  areaDataPositionKeys: string[] = [];
  playerPosition: string = '0_0';
  playerFacing: string = 'n';
  isLockedOut: boolean = false;
  numTurns: number = 0;

  ngOnInit(): void {
    this.subscriptions.push(
      this._gameService.isLockedOutObs.subscribe((data: boolean) => {
        this.isLockedOut = data;
      })
    );
    this.subscriptions.push(
      this._gameService.movementOptionsObs.subscribe(
        (data: MovementOptions) => {
          this.movementOptions = data;
          this.movementOptionsKeys = Object.keys(data);
        }
      )
    );
    this.subscriptions.push(
      this._gameService.gameStateObs.subscribe((data: GameState | null) => {
        if (data) {
          this.numTurns = data.numTurns;
          if (data.player.areaId !== this.areaId) {
            const areaId = data.player.areaId;
            const area = this._gameService.getArea(areaId);
            this.areaMap = area?.map || null;
            this.areaExits = area?.exits || [];
            this.areaItems = area?.items || [];
            this.areaDataPositionKeys = this.areaMap
              ? Object.keys(this.areaMap)
              : [];
          }
          this.playerPosition = `${data.player.y}_${data.player.x}`;
          this.playerFacing = data.player.facing;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
