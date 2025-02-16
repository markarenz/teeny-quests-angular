import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';

@Component({
  selector: 'app-area-cell-selector',
  standalone: true,
  imports: [],
  templateUrl: './area-cell-selector.component.html',
  styleUrl: './area-cell-selector.component.css',
})
export class AreaCellSelectorComponent {
  constructor(private _gameEditorService: GameEditorService) {}
  @Input('id') id: string = 'area-cell-selector';
  @Input('lockouts') lockouts: string[] = [];
  @Input('disabledCells') disabledCells: string[] = [];
  @Input('selectedCellPosition') selectedCellPosition: string = '';
  @Output() onPositionSelect: EventEmitter<string> = new EventEmitter<string>();

  areaDataPositionKeys: string[] = [];

  ngOnInit(): void {
    this.areaDataPositionKeys =
      this._gameEditorService.getPositionKeysForGridSize();
  }

  handleCellButtonClick(position: string) {
    this.onPositionSelect.emit(position);
  }
}
