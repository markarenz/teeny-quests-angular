import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameEditorServiceService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { GameArea, GameAreaMapCell } from '@app/features/main/interfaces/types';

@Component({
  selector: 'app-area-cell-modal',
  standalone: true,
  imports: [],
  templateUrl: './area-cell-modal.component.html',
  styleUrl: './area-cell-modal.component.css',
})
export class AreaCellModalComponent {
  constructor(private _gameEditorService: GameEditorServiceService) {}
  private subscriptions: Subscription[] = [];
  selectedCellPosition: string = '';
  selectedCell: GameAreaMapCell | null = null;
  showModal: boolean = false;

  buttons = [
    { label: 'Increase Height', direction: 'up' },
    { label: 'Decrease Height', direction: 'down' },
  ];

  ngOnInit(): void {
    this.subscriptions.push(
      this._gameEditorService.selectedCellPositionObs.subscribe(
        (data: string) => {
          this.selectedCellPosition = data;
          this.showModal = data !== '';
        }
      )
    );
    this.subscriptions.push(
      this._gameEditorService.selectedCellObs.subscribe(
        (data: GameAreaMapCell | null) => {
          this.selectedCell = data;
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  handleCellHeightChange(direction: string) {
    // update selected cell height
    if (this.selectedCell) {
      this._gameEditorService.setCellData({
        ...this.selectedCell,
        h: this.selectedCell.h + (direction === 'up' ? 1 : -1),
      });
    }
  }
}
