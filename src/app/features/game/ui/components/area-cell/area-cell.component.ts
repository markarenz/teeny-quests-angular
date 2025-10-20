import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  AreaPosition,
  getAreaElementPositionStyle,
} from '@app/features/game/lib/utils/index';
import { GameAreaMapCell, LightMap } from '@app/features/main/interfaces/types';
import { areaHeightFactor, defaultGridSize } from '@config/index';
import { TexturesFloorComponent } from '@app/features/game/ui/components/textures/textures-floor/textures-floor.component';
import { TexturesWallComponent } from '@app/features/game/ui/components/textures/textures-wall/textures-wall.component';
import { DecalsComponent } from '../area-cell/decals/decals.component';

@Component({
  selector: 'app-area-cell',
  standalone: true,
  imports: [TexturesFloorComponent, TexturesWallComponent, DecalsComponent],
  templateUrl: './area-cell.component.html',
  styleUrl: './area-cell.component.css',
})
export class AreaCellComponent {
  @Input('positionKey') positionKey: string = '';
  @Input('lightLevel') lightLevel: number = 0;
  @Input('isEditorMode') isEditorMode: boolean = false;
  @Input('selectedAreaCellPosition')
  selectedAreaCellPosition?: string = '';
  @Input('cellData') cellData: GameAreaMapCell | null = null;
  @Output() onClick = new EventEmitter<string>();

  gridSize: number = defaultGridSize;

  cell: any = {};
  position: AreaPosition = { left: '0', bottom: '0', z: 0 };
  height: string = '0%';
  width: string = '0%';
  svgViewBox: string = '0 0 100 50';
  svgPolygonPoints: string[] = [];
  isSelected: boolean = false;
  anyCellSelected: boolean = false;
  displayElements: {
    top: boolean;
    left: boolean;
    right: boolean;
    backLeft: boolean;
    backRight: boolean;
  } = {
    top: true,
    left: true,
    right: true,
    backLeft: false,
    backRight: false,
  };

  updateCellProps() {
    if (this.cell) {
      const { x, y, h } = this.cell;
      const cellW = 100 / this.gridSize;
      const cellH = 100 / this.gridSize / 2;
      this.position = getAreaElementPositionStyle(this.gridSize, y, x);
      this.width = `${cellW}%`;

      const hAdjusted = h * areaHeightFactor;
      this.height = `${cellH + cellH * 0.5 * hAdjusted}%`;

      const svgH = (hAdjusted + 1) * 25;

      this.svgViewBox = `0 0 100 ${svgH}`;
      this.svgPolygonPoints = [
        `0,0 50,25 50,${svgH} 0,${svgH - 25}`,
        `100,0 50,25 50,${svgH} 100,${svgH - 25}`,
        `100,25 50,0 50,${svgH - 25} 100,${svgH}`,
        `0,25 50,0 50,${svgH - 25} 0,${svgH}`,
      ];
      this.displayElements = {
        top: true,
        left: true,
        right: true,
        backLeft: false,
        backRight: false,
      };
    }
  }

  public handleClick() {
    if (this.isEditorMode) {
      this.onClick.emit(this.positionKey);
    }
  }
  ngOnChanges() {
    this.cell = this.cellData;
    this.isSelected = this.selectedAreaCellPosition === this.positionKey;
    this.updateCellProps();
  }

  ngOnInit() {
    this.cell = this.cellData;
    this.updateCellProps();
  }
}
