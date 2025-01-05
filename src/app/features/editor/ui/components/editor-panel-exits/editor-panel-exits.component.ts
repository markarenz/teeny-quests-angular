import { Component, input } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameEditorServiceService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { FormsModule } from '@angular/forms';
import {
  Game,
  GameAreaExit,
  SelectIUIOption,
} from '@app/features/main/interfaces/types';
import { AreaCellSelectorComponent } from '../area-cell-selector/area-cell-selector.component';
import { CollapsibleCardComponent } from '@app/features/main/ui/components/collapsible-card/collapsible-card.component';
import { ButtonComponent } from '@app/features/main/ui/components/button/button.component';
import { exitDefinitions, exitDirections } from '@content/exit-definitions';
import { IconButtonComponent } from '@app/features/main/ui/components/icon-button/icon-button.component';

@Component({
  selector: 'app-editor-panel-exits',
  standalone: true,
  imports: [
    FormsModule,
    ButtonComponent,
    CollapsibleCardComponent,
    AreaCellSelectorComponent,
    IconButtonComponent,
  ],
  templateUrl: './editor-panel-exits.component.html',
  styleUrl: './editor-panel-exits.component.css',
})
export class EditorPanelExitsComponent {
  constructor(private _gameEditorService: GameEditorServiceService) {}
  private subscriptions: Subscription[] = [];
  selectedAreaId: string = '';
  panelMode: string = '';
  exitTypeOptions: SelectIUIOption[] = exitDefinitions;
  exitDirectionOptions: SelectIUIOption[] = exitDirections;
  inputExitType: string = '';
  inputExitDirection: string = '';
  inputExitPosition: string = '';
  inputExitDestination: string = '';
  selectedExitId: string = '';
  exits: GameAreaExit[] = [];
  isSelectedPositionValid: boolean = false;
  areasListOptions: SelectIUIOption[] = [];

  refreshUIData() {
    this.areasListOptions = this._gameEditorService
      .getAreasListOptions()
      .filter((item) => item.value !== this.selectedAreaId);
  }

  ngOnInit() {
    this.subscriptions.push(
      this._gameEditorService.selectedExitIdObs.subscribe((data: string) => {
        this.selectedExitId = data;
        this.exits = this._gameEditorService.getExitsForCurrentArea();
      })
    );
    this.subscriptions.push(
      this._gameEditorService.selectedAreaIdObs.subscribe((data: any) => {
        this.selectedAreaId = data;
        this.exits = this._gameEditorService.getExitsForCurrentArea();
        this.refreshUIData();
        this.selectedExitId = '';
      })
    );
    this.subscriptions.push(
      this._gameEditorService.gameObs.subscribe((_data: any) => {
        this.exits = this._gameEditorService.getExitsForCurrentArea();
        this.refreshUIData();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  handleDeleteClick(id: string) {
    this._gameEditorService.deleteExit(id);
  }
  handleEditClick(id: string) {
    this.selectedExitId = id;
    const selectedExit = this.exits.find((exit) => exit.id === id);
    this.inputExitPosition = selectedExit
      ? `${selectedExit.y}_${selectedExit.x}`
      : '';
    this.inputExitDirection = selectedExit ? selectedExit.direction : '';
    this.inputExitType = selectedExit ? selectedExit.exitType : '';
    this.inputExitDestination = selectedExit
      ? selectedExit.destinationAreaId
      : '';
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
        x: +x,
        y: +y,
      };

      this._gameEditorService.updateExit(updatedExit);
    }
  }

  // Current cell position CANNOT match existing exits to be valid

  // List all exits, if none show "no exits" message (not a Sartre reference)
  // Under list, show the create button
  // Create button is only enabled when we have a cell selected above
  // Add message indicating this in the UI
  // If exit selected (via service), display editor:
  // - Position selector
  // - Type selector
  // - Direction selector
  // All changes are live
}
