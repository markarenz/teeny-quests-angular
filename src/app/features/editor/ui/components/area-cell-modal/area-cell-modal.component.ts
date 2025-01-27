import { Component, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { GameEditorServiceService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { ButtonComponent } from '@app/features/main/ui/components/button/button.component';
import { ButtonCloseComponent } from '@app/features/main/ui/components/button-close/button-close.component';
import { GameAreaMapCell } from '@app/features/main/interfaces/types';
import { defaultGridSize, maxAreaCellHeight } from '@config/index';
import { getAreaElementPositionStyle } from '@app/features/game/lib/utils';

@Component({
  selector: 'app-area-cell-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, ButtonCloseComponent],
  templateUrl: './area-cell-modal.component.html',
  styleUrl: './area-cell-modal.component.css',
})
export class AreaCellModalComponent {
  @Output() clearCellSelection = new EventEmitter<string>();
  constructor(private _gameEditorService: GameEditorServiceService) {}
  private subscriptions: Subscription[] = [];
  selectedCellPosition: string = '';
  selectedCell: GameAreaMapCell | null = null;
  inputHeight: number = 1;
  inputHeightMax: number = maxAreaCellHeight;
  isFormValid: boolean = false;
  showModal: boolean = false;
  modalPosition: { bottom: string; left: string } = {
    bottom: '0%',
    left: '0%',
  };

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
          const { x, y, h } = data ?? { x: 1, y: 1, h: 1 };
          this.inputHeight = h;
          // set left 50%
          this.modalPosition = getAreaElementPositionStyle(
            defaultGridSize,
            y,
            x
          );
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
  validateForm() {
    this.isFormValid = true;
  }

  handleCancelClick() {
    this.clearCellSelection.emit();
  }
  handleOkClick() {
    if (this.selectedCell) {
      this._gameEditorService.setCellData({
        ...this.selectedCell,
        h: this.inputHeight,
      });
    }
  }
}
