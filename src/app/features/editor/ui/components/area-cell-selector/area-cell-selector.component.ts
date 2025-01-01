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

  areaDataPositionKeys: string[] = [];

  ngOnInit(): void {
    this.areaDataPositionKeys =
      this._gameEditorService.getPositionKeysForGridSize();
  }

  handleCellButtonClick(position: string) {
    this._gameEditorService.setSelectedCellPosition(position);
  }
}
