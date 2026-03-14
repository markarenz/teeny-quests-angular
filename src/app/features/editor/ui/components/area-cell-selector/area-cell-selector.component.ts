import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { getPositionKeysForGridSize } from '@main/utils';

@Component({
  selector: 'app-area-cell-selector',
  imports: [],
  templateUrl: './area-cell-selector.component.html',
  styleUrl: './area-cell-selector.component.css',
  standalone: true,
})
export class AreaCellSelectorComponent {
  constructor(private _gameEditorService: GameEditorService) {}
  @Input('id') id: string = 'area-cell-selector';
  @Input('lockouts') lockouts: string[] = [];
  @Input('disabledCells') disabledCells: string[] = [];
  @Input('selectedCellPosition') selectedCellPosition: string = '';
  @Input('selectedCellPositions') selectedCellPositions: string[] = [];
  @Output() onPositionSelect: EventEmitter<string> = new EventEmitter<string>();

  areaDataPositionKeys: string[] = [];

  ngOnInit(): void {
    this.areaDataPositionKeys = getPositionKeysForGridSize();
  }

  handleCellButtonClick(position: string) {
    this.onPositionSelect.emit(position);
  }
}
