import { Component, Input } from '@angular/core';
import { defaultGridSize } from '@config/index';
import { AreaPosition } from '@app/features/game/lib/utils';
import { getAreaElementPositionStyle } from '@app/features/game/lib/utils';

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

  x: number = 0;
  y: number = 0;
  z: number = 0;
  title: string = '';
  gridSize: number = defaultGridSize;
  position: AreaPosition = { left: '0', bottom: '0', z: 0 };
  height: string = '0%';
  width: string = '0%';

  ngOnInit() {
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
    console.log('Move to positionKey:', this.positionKey);
  }
}
