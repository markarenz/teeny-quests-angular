import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { FormsModule } from '@angular/forms';
import {
  GameArea,
  GameAreaExit,
  GameItem,
  SelectIUIOption,
} from '@app/features/main/interfaces/types';
import { AreaCellSelectorComponent } from '../area-cell-selector/area-cell-selector.component';
import { CollapsibleCardComponent } from '@app/features/main/ui/components/collapsible-card/collapsible-card.component';
import { exitDefinitions, exitDirections } from '@content/exit-definitions';
import { IconButtonComponent } from '@app/features/main/ui/components/icons/icon-button/icon-button.component';
import { getPositionKeysForGridSize } from '@main/utils';
import { floorDefinitions } from '@content/floor-definitions';

@Component({
  selector: 'app-editor-panel-exits',
  standalone: true,
  imports: [
    FormsModule,
    CollapsibleCardComponent,
    AreaCellSelectorComponent,
    IconButtonComponent,
  ],
  templateUrl: './editor-panel-exits.component.html',
  styleUrl: './editor-panel-exits.component.css',
})
export class EditorPanelExitsComponent {
  constructor(private _gameEditorService: GameEditorService) {}
  private subscriptions: Subscription[] = [];
  selectedAreaId: string = '';
  panelMode: string = '';
  exitTypeOptions: SelectIUIOption[] = exitDefinitions;
  exitDirectionOptions: SelectIUIOption[] = exitDirections;
  inputExitType: string = '';
  inputExitDirection: string = '';
  inputExitPosition: string = '';
  inputExitDestination: string = '';
  inputExitDestinationExit: string = '';
  selectedExitId: string = '';
  exits: GameAreaExit[] = [];
  isSelectedPositionValid: boolean = false;
  areasListOptions: SelectIUIOption[] = [];
  exitsListOptions: SelectIUIOption[] = [];
  lockouts: string[] = [];
  area: GameArea | null = null;

  refreshUIData() {
    this.areasListOptions = this._gameEditorService
      .getDestinationAreasListOptions()
      .filter((item) => item.value !== this.selectedAreaId);

    this.exitsListOptions = [
      { value: '', label: 'None' },
      ...this._gameEditorService
        .getDestinationExitsListOptions(this.inputExitDestination)
        .filter((item) => item.value !== this.selectedExitId),
    ];
  }

  updateExitPositionLockouts() {
    if (this.area) {
      const newLockouts: string[] = [];
      this.area.items.forEach((item: GameItem) => {
        newLockouts.push(`${item.y}_${item.x}`);
      });
      this.area.exits.forEach((exit: GameAreaExit) => {
        if (exit.id !== this.selectedExitId) {
          newLockouts.push(`${exit.y}_${exit.x}`);
        }
      });
      const positionKeys = getPositionKeysForGridSize();
      const map = this.area.map;
      positionKeys.forEach((position: string) => {
        const floor = floorDefinitions[map[position].floor];
        if (!floor.walkable && !newLockouts.includes(position)) {
          newLockouts.push(position);
        }
      });

      this.lockouts = newLockouts;
    }
  }

  ngOnInit() {
    this.subscriptions.push(
      this._gameEditorService.selectedExitIdObs.subscribe((data: string) => {
        this.selectedExitId = data;
        this.exits = this._gameEditorService.getExitsForCurrentArea();
        this.updateUiAfterExitSelection(data);
      })
    );
    this.subscriptions.push(
      this._gameEditorService.selectedAreaIdObs.subscribe((data: any) => {
        if (this.selectedAreaId !== data) {
          this.selectedAreaId = data;
          this.exits = this._gameEditorService.getExitsForCurrentArea();
          this.refreshUIData();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  handleDeleteClick(id: string) {
    this._gameEditorService.deleteExit(id);
  }

  updateUiAfterExitSelection(id: string) {
    const selectedExit = this.exits.find((exit) => exit.id === id);
    this.inputExitPosition = selectedExit
      ? `${selectedExit.y}_${selectedExit.x}`
      : '';
    this.inputExitDirection = selectedExit ? selectedExit.direction : '';
    this.inputExitType = selectedExit ? selectedExit.exitType : '';
    this.inputExitDestination = selectedExit
      ? selectedExit.destinationAreaId
      : '';
    this.inputExitDestinationExit = selectedExit
      ? selectedExit.destinationExitId
      : '';
    this.updateExitPositionLockouts();
    this.refreshUIData();
  }

  handleEditClick(id: string) {
    this._gameEditorService.selectExit(id);
    this.updateUiAfterExitSelection(id);
  }

  handlePositionSelect(position: string) {
    this.inputExitPosition = position;
    this.handleExitInputChange();
  }

  handleCreateClick() {
    const exit: GameAreaExit | null = this._gameEditorService.createExit();
    if (exit) {
      this.handleEditClick(exit.id);
    }
  }

  handleExitInputChange() {
    const selectedExit = this.exits.find(
      (exit) => exit.id === this.selectedExitId
    );
    const [y, x] = this.inputExitPosition.split('_');
    if (selectedExit) {
      const updatedExit: GameAreaExit = {
        ...selectedExit,
        id: this.selectedExitId,
        exitType: this.inputExitType,
        areaId: this.selectedAreaId,
        direction: this.inputExitDirection,
        destinationAreaId: this.inputExitDestination,
        destinationExitId: this.inputExitDestinationExit,
        x: +x,
        y: +y,
      };

      this._gameEditorService.updateExit(updatedExit);
    }
  }
}
