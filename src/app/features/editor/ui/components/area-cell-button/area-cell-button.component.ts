import { Component, Input } from '@angular/core';
import {
  AreaPosition,
  getAreaItemPositionStyle,
} from '@app/features/game/lib/utils/index';
import { defaultGridSize } from '@config/index';
import { GameEditorServiceService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';

@Component({
  selector: 'app-area-cell-button',
  standalone: true,
  imports: [],
  templateUrl: './area-cell-button.component.html',
  styleUrl: './area-cell-button.component.css',
})
export class AreaCellButtonComponent {
  constructor(private _gameEditorService: GameEditorServiceService) {}

  @Input('positionKey') positionKey: string = '';
  x: number = 0;
  y: number = 0;
  z: number = 0;
  gridSize: number = defaultGridSize;
  position: AreaPosition = { left: '0', bottom: '0', z: 0 };
  height: string = '0%';
  width: string = '0%';

  ngOnInit() {
    const cellW = 100 / this.gridSize;
    const positionKeyArr = this.positionKey.split('_');
    this.x = parseInt(positionKeyArr[1]);
    this.y = parseInt(positionKeyArr[0]);
    this.z = this.x * this.y + this.x + 100;
    this.position = getAreaItemPositionStyle(this.gridSize, this.y, this.x);
    this.height = `${cellW / 2}%`;
    this.width = `${cellW}%`;
  }

  handleCellButtonClick() {
    this._gameEditorService.setSelectedCellPosition(`${this.y}_${this.x}`);
  }
}
