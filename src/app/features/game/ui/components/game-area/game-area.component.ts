import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from '@app/features/game/services/game-service/game-service.service';
import {
  GameAreaExit,
  GameAreaMap,
  GameItem,
  GamePanelDeco,
  GameState,
  MovementOptions,
} from '@app/features/main/interfaces/types';
import { AreaCellComponent } from '@app/features/game/ui/components/area-cell/area-cell.component';
import { AreaExitComponent } from '@app/features/game/ui/components/area-exit/area-exit.component';
import { AreaItemComponent } from '@app/features/game/ui/components/area-item/area-item.component';
import { AreaPanelComponent } from '../area-panel/area-panel.component';
import { GamePlayerComponent } from '../game-player/game-player.component';
import { GameMovementOptionButtonComponent } from '../game-movement-option-button/game-movement-option-button.component';

@Component({
  selector: 'app-game-area',
  standalone: true,
  imports: [
    AreaCellComponent,
    AreaExitComponent,
    AreaItemComponent,
    AreaPanelComponent,
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
  areaPanels: GamePanelDeco[] = [];
  movementOptions: { [key: string]: string[] } = {};
  movementOptionsKeys: string[] = [];
  areaDataPositionKeys: string[] = [];
  playerPosition: string = '0_0';
  playerFacing: string = 'north';
  isLockedOut: boolean = false;
  numTurns: number = 0;
  areaTransitionMode: string = 'cover';

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
      this._gameService.areaTransitionModeObs.subscribe((data: string) => {
        this.areaTransitionMode = data;
      })
    );
    this.subscriptions.push(
      this._gameService.gameStateObs.subscribe((data: GameState | null) => {
        if (data) {
          this.numTurns = data.numTurns;
          if (data.player.areaId !== this.areaId) {
            const areaId = data.player.areaId;
            const area = this._gameService.getArea(areaId);
            const gameStateArea = this._gameService.getGameStateArea(areaId);
            this.areaMap = area?.map || null;
            this.areaExits = gameStateArea?.exits || [];
            this.areaItems = gameStateArea?.items || [];
            this.areaPanels = gameStateArea?.panels || [];
            this.areaDataPositionKeys = this.areaMap
              ? Object.keys(this.areaMap)
              : [];
          }
          // if moving...
          this.playerPosition = `${data.player.y}_${data.player.x}`;
          this.playerFacing = data.player.facing;
        }
      })
    );
  }

  handleExitClick(exitId: string) {
    // process turn exit destination area, destination position, destination facing (opposite of exit direction)
    this._gameService.processTurn({
      verb: 'exit',
      noun: exitId,
    });
  }

  handlePanelClick(panelId: string) {
    // this._gameService.processTurn({ verb: 'item-click', noun: itemId });
  }
  handleItemClick(itemId: string) {
    this._gameService.processTurn({ verb: 'item-click', noun: itemId });
  }

  getIsNearPlayer(x: number, y: number): boolean {
    return this.playerPosition === `${y}_${x}`;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
