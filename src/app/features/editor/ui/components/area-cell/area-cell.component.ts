import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameEditorServiceService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import {
  AreaPosition,
  getAreaItemPositionStyle,
} from '@app/features/game/lib/utils/index';
import { GameArea, GameAreaMapCell } from '@app/features/main/interfaces/types';
import { defaultGridSize } from '@config/index';
import { TexturesFloorComponent } from '@app/features/game/ui/components/textures/textures-floor/textures-floor.component';

@Component({
  selector: 'app-area-cell',
  standalone: true,
  imports: [TexturesFloorComponent],
  templateUrl: './area-cell.component.html',
  styleUrl: './area-cell.component.css',
})
export class AreaCellComponent {
  constructor(private _gameEditorService: GameEditorServiceService) {}
  private subscriptions: Subscription[] = [];

  @Input('positionKey') positionKey: string = '';
  @Input('cellData') cellData: GameAreaMapCell | null = null;

  gridSize: number = defaultGridSize;

  cell: any = {};
  position: AreaPosition = { left: '0', bottom: '0', z: 0 };
  height: string = '0%';
  width: string = '0%';
  svgViewBox: string = '0 0 100 50';
  svgPolygonPoints: string[] = [];
  isSelected: boolean = false;
  anyCellSelected: boolean = false;
  selectedCell: GameAreaMapCell | null = null;
  floorTexture: string = '';
  wallLeftTexture: string = '';
  wallRightTexture: string = '';
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
      this.position = getAreaItemPositionStyle(this.gridSize, y, x);
      this.height = `${cellH + cellH * 0.5 * h}%`;
      this.width = `${cellW}%`;
      const svgH = (h + 1) * 25;
      this.svgViewBox = `0 0 100 ${svgH}`;
      this.svgPolygonPoints = [
        `0,0 50,25 50,${svgH} 0,${svgH - 25}`,
        `100,0 50,25 50,${svgH} 100,${svgH - 25}`,
        // ??
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

      this.floorTexture = `url(#texture-${this.cell.floor ?? 'default'})`;
      // const wall = wallDefinitions.find((item) => item.id === this.cell.wall);
    }
  }

  ngOnInit() {
    this.cell = this.cellData;

    this.subscriptions.push(
      this._gameEditorService.selectedCellPositionObs.subscribe(
        (data: string) => {
          this.anyCellSelected = data !== '';
          this.isSelected = data === `${this.cell?.y}_${this.cell?.x}`;
        }
      )
    );

    this.subscriptions.push(
      this._gameEditorService.selectedCellObs.subscribe(
        (data: GameAreaMapCell | null) => {
          this.selectedCell = data;
          if (this.isSelected) {
            this.cell = data;
            this.updateCellProps();
          }
        }
      )
    );

    this.updateCellProps();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
