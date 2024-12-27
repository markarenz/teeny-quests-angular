import { Component, Input } from '@angular/core';
import { defaultGridSize } from '@config/index';
import { GameEditorServiceService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';

@Component({
  selector: 'app-area-cell-selector',
  standalone: true,
  imports: [],
  templateUrl: './area-cell-selector.component.html',
  styleUrl: './area-cell-selector.component.css',
})
export class AreaCellSelectorComponent {
  constructor(private _gameEditorService: GameEditorServiceService) {}
  @Input('id') id: string = 'area-cell-selector';
  @Input('disabledCells') disabledCells: string[] = [];
  @Input('selectedCellPosition') selectedCellPosition: string = '';

  // TODO: add disabledcells array support

  numCells = defaultGridSize * defaultGridSize;
  areaDataPositionKeys: string[] = [];

  ngOnInit(): void {
    this.areaDataPositionKeys = Array.from(
      { length: this.numCells },
      (_, i) => {
        const x = i % defaultGridSize;
        const y = Math.floor(i / defaultGridSize);
        return `${y}_${x}`;
      }
    );
  }

  handleCellButtonClick(position: string) {
    this._gameEditorService.setSelectedCellPosition(position);
  }
}
