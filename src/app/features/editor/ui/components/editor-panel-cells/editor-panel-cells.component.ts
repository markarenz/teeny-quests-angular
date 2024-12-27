import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameEditorServiceService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { AreaCellSelectorComponent } from '../area-cell-selector/area-cell-selector.component';
import { CollapsibleCardComponent } from '@app/features/main/ui/components/collapsible-card/collapsible-card.component';
import { GameAreaMapCell } from '@app/features/main/interfaces/types';
import { maxAreaCellHeight } from '@config/index';
import { wallDefinitions } from '@content/wall-definitions';
import { floorDefinitions } from '@content/floor-definitions';
import { EditorTextureSelectorComponent } from '../editor-texture-selector/editor-texture-selector.component';
import { IconCaretComponent } from '../../../../main/ui/components/icons/icon-caret/icon-caret.component';
import { ButtonComponent } from '@app/features/main/ui/components/button/button.component';

@Component({
  selector: 'app-editor-panel-cells',
  standalone: true,
  imports: [
    AreaCellSelectorComponent,
    CollapsibleCardComponent,
    EditorTextureSelectorComponent,
    IconCaretComponent,
    ButtonComponent,
  ],
  templateUrl: './editor-panel-cells.component.html',
  styleUrl: './editor-panel-cells.component.css',
})
export class EditorPanelCellsComponent {
  constructor(private _gameEditorService: GameEditorServiceService) {}
  private subscriptions: Subscription[] = [];
  isCellSelectorOpen: boolean = false;
  selectedCellPosition: string = '';
  selectedCell: GameAreaMapCell | null = null;
  maxHeight: number = maxAreaCellHeight;
  floorOptions = floorDefinitions;
  currentFloorOption = 'default';
  currentWallLOption = 'default';
  currentWallROption = 'default';
  wallOptions = wallDefinitions;

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
          const thisFloor = floorDefinitions.find(
            (floor) => floor.id === this.selectedCell?.floor
          );
          this.currentFloorOption = thisFloor?.name ?? 'default';
          const thisWallL = wallDefinitions.find(
            (wall) => wall.id === this.selectedCell?.wallSouth
          );
          this.currentWallLOption = thisWallL?.name ?? 'default';
          const thisWallR = wallDefinitions.find(
            (wall) => wall.id === this.selectedCell?.wallEast
          );
          this.currentWallROption = thisWallR?.name ?? 'default';
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

  handleCellDeselect() {
    this._gameEditorService.setSelectedCellPosition('');
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
