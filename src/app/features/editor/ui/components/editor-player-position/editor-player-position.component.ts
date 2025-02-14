import { Component, Input } from '@angular/core';
import { GameEditorServiceService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { GameROM, GameArea } from '@app/features/main/interfaces/types';
import { Subscription } from 'rxjs';
import { defaultGridSize } from '@config/index';
import {
  AreaPosition,
  getAreaElementPositionStyle,
} from '@app/features/game/lib/utils';
import { SvgPlayerComponent } from '@app/features/game/ui/svg-player/svg-player.component';

@Component({
  selector: 'app-editor-player-position',
  standalone: true,
  imports: [SvgPlayerComponent],
  templateUrl: './editor-player-position.component.html',
  styleUrl: './editor-player-position.component.css',
})
export class EditorPlayerPositionComponent {
  constructor(private _gameEditorService: GameEditorServiceService) {}
  private subscriptions: Subscription[] = [];

  selectedAreaId: string = '';
  selectedArea: GameArea | null = null;
  h: number = 0;
  positionStyle: AreaPosition = { left: '0', bottom: '0', z: 0 };
  width: string = '0%';
  @Input('playerPosition') playerPosition: string = '';

  updatePlayerPositionHeight() {
    const cell = this.selectedArea?.map[this.playerPosition];
    if (cell) {
      this.h = cell.h;
    }

    const [x, y] = this.playerPosition.split('_').map((v) => parseInt(v));
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
      // also keep track of selected area id
      this._gameEditorService.selectedAreaIdObs.subscribe(
        (data: string | null) => {
          if (data) {
            this.selectedAreaId = data;
            this.updatePlayerPositionHeight();
          }
        }
      ),
      this._gameEditorService.gameObs.subscribe((data: GameROM | null) => {
        if (data) {
          const area = data.content.areas[this.selectedAreaId];
          if (area) {
            this.selectedArea = area;
            this.updatePlayerPositionHeight();
          }
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  ngOnChanges() {
    this.updatePlayerPositionHeight();
  }
}
