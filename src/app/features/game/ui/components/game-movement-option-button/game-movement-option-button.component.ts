import { Component, Input, Output, EventEmitter } from '@angular/core';
import { defaultGridSize } from '@config/index';
import { AreaPosition } from '@game/lib/utils';
import { getAreaElementPositionStyle } from '@game/lib/utils';
import { GameService } from '@game/services/game-service/game-service.service';
import { getHeuristicDistance } from '@game/services/game-service/utils/pathfinding';

@Component({
  selector: 'app-game-movement-option-button',
  standalone: true,
  imports: [],
  templateUrl: './game-movement-option-button.component.html',
  styleUrl: './game-movement-option-button.component.css',
})
export class GameMovementOptionButtonComponent {
  @Input('positionKey') positionKey: string = '0_0';
  @Input('h') h: number = 1;
  @Input('isLockedOut') isLockedOut: boolean = false;
  @Input('playerPosition') playerPosition: string = '0_0';
  @Output() HandleMovementClick = new EventEmitter<string>();

  x: number = 0;
  y: number = 0;
  z: number = 0;
  transformDelay: string = '0s';
  title: string = '';
  gridSize: number = defaultGridSize;
  position: AreaPosition = { left: '0', bottom: '0', z: 0 };
  height: string = '0%';
  width: string = '0%';

  constructor(private _gameService: GameService) {}

  ngOnInit() {
    const distance = getHeuristicDistance(
      this.positionKey,
      this.playerPosition
    );
    this.transformDelay = `${distance * 0.05}s`;
    this.updateCellProps();
  }

  updateCellProps() {
    const positionKeyArr = this.positionKey.split('_');
    this.x = parseInt(positionKeyArr[1]);
    this.y = parseInt(positionKeyArr[0]);
    this.z = this.x * this.y + this.x + 1;
    this.title = `Move to ${this.x}, ${this.y}`;
    const cellW = 100 / this.gridSize;
    const cellH = 100 / this.gridSize / 2;
    this.position = getAreaElementPositionStyle(this.gridSize, this.y, this.x);
    this.height = `${cellH + cellH * 0.5 * this.h}%`;
    this.width = `${cellW}%`;
    const svgH = (this.h + 1) * 25;
  }

  // Handle click processturn
  // -- verb: move
  // -- noun: positionKey
  handleMovementButtonClick() {
    this._gameService.processTurn({ verb: 'move', noun: this.positionKey });
  }
}
