import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
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
import { mapCellDecalOptions } from '@content/constants';
import { TooltipComponent } from '@app/features/main/ui/components/tooltip/tooltip.component';
import { getLabelFromSlug } from '@app/features/main/utils';
import { commonText } from '@content/text';

@Component({
  selector: 'app-editor-panel-cells',
  standalone: true,
  imports: [
    FormsModule,
    AreaCellSelectorComponent,
    CollapsibleCardComponent,
    EditorTextureSelectorComponent,
    IconButtonComponent,
    ButtonComponent,
    TooltipComponent,
  ],
  templateUrl: './editor-panel-cells.component.html',
  styleUrl: './editor-panel-cells.component.css',
})
export class EditorPanelCellsComponent {
  constructor(private _gameEditorService: GameEditorService) {}
  private subscriptions: Subscription[] = [];
  public isCellSelectorOpen: boolean = false;
  public selectedCellPosition: string = '';
  public selectedCell: GameAreaMapCell | null = null;
  public maxHeight: number = maxAreaCellHeight;
  public floorOptions = floorOptionsData;
  public currentFloorOption = 'default';
  public currentWallLOption = 'default';
  public currentWallROption = 'default';
  public currentDecal = '';
  public currentDecalLabel = '';
  public wallOptions = wallOptionsData;
  public decalOptions = mapCellDecalOptions;
  public canHideCell: boolean = false;
  public inputCellHidden: boolean = false;
  public commonText = commonText;

  buttons = [
    { label: 'Increase Height', direction: 'up' },
    { label: 'Decrease Height', direction: 'down' },
  ];

  ngOnInit() {
    this.subscriptions.push(
      this._gameEditorService.selectedCellPositionObs.subscribe(
        (data: string | null) => {
          this.selectedCellPosition = data ?? '';
          this.canHideCell = this._gameEditorService.getCanMapCellBeHidden(
            data ?? ''
          );
        }
      )
    );
    this.subscriptions.push(
      this._gameEditorService.selectedCellObs.subscribe(
        (data: GameAreaMapCell | null) => {
          this.selectedCell = data ?? null;
          const thisFloor = this.floorOptions.find(
            floor => floor.value === this.selectedCell?.floor
          );
          this.currentFloorOption = thisFloor?.label ?? 'default';
          const thisWallL = this.wallOptions.find(
            wall => wall.value === this.selectedCell?.wallSouth
          );
          this.currentWallLOption = thisWallL?.label ?? 'default';
          const thisWallR = this.wallOptions.find(
            wall => wall.value === this.selectedCell?.wallEast
          );
          this.currentWallROption = thisWallR?.label ?? 'default';
          this.currentDecal = this.selectedCell?.decal || '';
          this.inputCellHidden = this.selectedCell?.isHidden || false;
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
  handleDecalChange() {
    if (this.selectedCell) {
      this.currentDecalLabel = getLabelFromSlug(this.currentDecal);
      this._gameEditorService.setCellData({
        ...this.selectedCell,
        decal: this.currentDecal,
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

  hideMapCell() {
    if (this.selectedCell && this.selectedCellPosition) {
      this.inputCellHidden = !this.inputCellHidden;
      this._gameEditorService.setCellData({
        ...this.selectedCell,
        isHidden: this.inputCellHidden,
      });
    }
  }
}
