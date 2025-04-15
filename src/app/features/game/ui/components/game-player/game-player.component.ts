import { Component, Input } from '@angular/core';
import { SvgPlayerComponent } from '../../svg-player/svg-player.component';
import { Subscription } from 'rxjs';
import { GameService } from '@app/features/game/services/game-service/game-service.service';
import {
  AreaPosition,
  getAreaElementPositionStyle,
} from '@app/features/game/lib/utils';
import { defaultGridSize } from '@config/index';
import { GameAreaMapCell } from '@app/features/main/interfaces/types';

@Component({
  selector: 'app-game-player',
  standalone: true,
  imports: [SvgPlayerComponent],
  templateUrl: './game-player.component.html',
  styleUrl: './game-player.component.css',
})
export class GamePlayerComponent {
  private subscriptions: Subscription[] = [];
  @Input('playerPosition') playerPosition: string = '0_0';
  @Input('playerFacing') playerFacing: string = 'n';
  @Input('cellData') cellData: GameAreaMapCell | null = null;

  h: number = 0;
  positionStyle: AreaPosition = { left: '0', bottom: '0', z: 0 };
  width: string = '0%';
  exitTransitionClass = '';

  constructor(private _gameService: GameService) {}

  updatePlayerPosition() {
    if (!this.cellData) {
      return;
    }
    if (this.cellData) {
      this.h = this.cellData.h;
    }

    const [y, x] = this.playerPosition.split('_').map((v) => parseInt(v));
    const cellW = 100 / defaultGridSize;
    this.width = `${cellW}%`;

    this.positionStyle = getAreaElementPositionStyle(
      defaultGridSize,
      y,
      x,
      this.h
    );
    this.width = `${cellW}%`;
  }

  ngOnInit() {
    this.subscriptions.push(
      this._gameService.exitingDirectionObs.subscribe((data: string) => {
        this.exitTransitionClass = `exit-direction-${data}`;
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngOnChanges() {
    this.updatePlayerPosition();
  }
}
