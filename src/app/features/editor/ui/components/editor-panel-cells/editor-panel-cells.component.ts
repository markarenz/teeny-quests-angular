import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { AreaCellSelectorComponent } from '../area-cell-selector/area-cell-selector.component';
import { CollapsibleCardComponent } from '@app/features/main/ui/components/collapsible-card/collapsible-card.component';
import { GameAreaMapCell } from '@app/features/main/interfaces/types';
import { maxAreaCellHeight } from '@config/index';
import { wallOptionsData } from '@content/wall-definitions';
import { floorOptionsData } from '@content/floor-definitions';
import { EditorTextureSelectorComponent } from '../editor-texture-selector/editor-texture-selector.component';
import { IconButtonComponent } from '@app/features/main/ui/components/icons/icon-button/icon-button.component';
import { ButtonComponent } from '@app/features/main/ui/components/button/button.component';

@Component({
  selector: 'app-editor-panel-cells',
  standalone: true,
  imports: [
    AreaCellSelectorComponent,
    CollapsibleCardComponent,
    EditorTextureSelectorComponent,
    IconButtonComponent,
    ButtonComponent,
  ],
  templateUrl: './editor-panel-cells.component.html',
  styleUrl: './editor-panel-cells.component.css',
})
export class EditorPanelCellsComponent {
  constructor(private _gameEditorService: GameEditorService) {}
  private subscriptions: Subscription[] = [];
  isCellSelectorOpen: boolean = false;
  selectedCellPosition: string = '';
  selectedCell: GameAreaMapCell | null = null;
  maxHeight: number = maxAreaCellHeight;
  floorOptions = floorOptionsData;
  currentFloorOption = 'default';
  currentWallLOption = 'default';
  currentWallROption = 'default';
  wallOptions = wallOptionsData;

  buttons = [
    { label: 'Increase Height', direction: 'up' },
    { label: 'Decrease Height', direction: 'down' },
  ];

  ngOnInit() {
    this.subscriptions.push(
      this._gameEditorService.selectedCellPositionObs.subscribe(
        (data: string | null) => {
          this.selectedCellPosition = data ?? '';
        }
      )
    );
    this.subscriptions.push(
      this._gameEditorService.selectedCellObs.subscribe(
        (data: GameAreaMapCell | null) => {
          this.selectedCell = data ?? null;
          const thisFloor = this.floorOptions.find(
            (floor) => floor.value === this.selectedCell?.floor
          );
          this.currentFloorOption = thisFloor?.label ?? 'default';
          const thisWallL = this.wallOptions.find(
            (wall) => wall.value === this.selectedCell?.wallSouth
          );
          this.currentWallLOption = thisWallL?.label ?? 'default';
          const thisWallR = this.wallOptions.find(
            (wall) => wall.value === this.selectedCell?.wallEast
          );
          this.currentWallROption = thisWallR?.label ?? 'default';
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  handleToggleCellSelector() {
    this.isCellSelectorOpen = !this.isCellSelectorOpen;
  }

  handleCellSelect(position: string) {
    this._gameEditorService.setSelectedCellPosition(position);
  }

  handleCellDeselect() {
    this._gameEditorService.setSelectedCellPosition('');
    this.isCellSelectorOpen = false;
  }

  handleCellHeightChange(direction: string) {
    if (this.selectedCell) {
      this._gameEditorService.setCellData({
        ...this.selectedCell,
        h: this.selectedCell.h + (direction === 'up' ? 1 : -1),
      });
    }
  }
  handleFloorChange(floorType: string) {
    if (this.selectedCell) {
      this._gameEditorService.setCellData({
        ...this.selectedCell,
        floor: floorType,
      });
    }
  }

  handleWallChange(wallId: string, wallPosition: string) {
    if (this.selectedCell) {
      this._gameEditorService.setCellData({
        ...this.selectedCell,
        [wallPosition === 'south' ? 'wallSouth' : 'wallEast']: wallId,
      });
    }
  }
  handleResetTexturesClick() {
    this._gameEditorService.resetTexturesForCurrentArea();
  }
}
