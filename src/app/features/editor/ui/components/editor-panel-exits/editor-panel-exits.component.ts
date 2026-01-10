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
import { TooltipComponent } from '@app/features/main/ui/components/tooltip/tooltip.component';
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
    TooltipComponent,
  ],
  templateUrl: './editor-panel-exits.component.html',
  styleUrl: './editor-panel-exits.component.css',
})
export class EditorPanelExitsComponent {
  constructor(private _gameEditorService: GameEditorService) {}
  private subscriptions: Subscription[] = [];
  public selectedAreaId: string = '';
  public panelMode: string = '';
  public exitTypeOptions: SelectIUIOption[] = exitDefinitions;
  public exitDirectionOptions: SelectIUIOption[] = exitDirections;
  public inputExitType: string = '';
  public inputExitDirection: string = '';
  public inputExitPosition: string = '';
  public inputExitDestination: string = '';
  public inputExitDestinationExit: string = '';
  public inputExitLockType: string = '';
  public inputExitName: string = '';
  public isEnabledReciprocalExits: boolean = true;
  public selectedExitId: string = '';
  public exits: GameAreaExit[] = [];
  public isSelectedPositionValid: boolean = false;
  public areasListOptions: SelectIUIOption[] = [];
  public exitsListOptions: SelectIUIOption[] = [];
  public exitsLockOptions: SelectIUIOption[] = [
    { value: '', label: 'None' },
    { value: 'silver', label: 'Silver' },
    { value: 'gold', label: 'Gold' },
  ];
  public lockouts: string[] = [];
  public area: GameArea | null = null;

  public refreshUIData() {
    this.areasListOptions = this._gameEditorService.getAreasListOptions();

    const propOnCell = this.area?.props.find(prop => {
      const position = this.inputExitPosition;
      const [y, x] = position.split('_');
      return prop.x === +x && prop.y === +y;
    });
    this.exitDirectionOptions = exitDirections.filter(option => {
      // if there is a prop on this square, ignore options that match the wall value
      if (propOnCell && propOnCell.wall === option.value) {
        return false;
      }
      return true;
    });
    this.exitsListOptions = [
      { value: '', label: 'None' },
      ...this._gameEditorService
        .getDestinationExitsListOptions(this.inputExitDestination)
        .filter(item => item.value !== this.selectedExitId),
    ];
  }

  public updateExitPositionLockouts() {
    if (this.area) {
      const newLockouts: string[] = [];
      this.area.items.forEach((item: GameItem) => {
        newLockouts.push(`${item.y}_${item.x}`);
      });
      const selectedExit = this.exits.find(
        exit => exit.id === this.selectedExitId
      );
      this.area.props.forEach(prop => {
        if (
          this.area?.exits.some(
            exit =>
              selectedExit?.id !== exit.id &&
              exit.x === prop.x &&
              exit.y === prop.y
          )
        ) {
          newLockouts.push(`${prop.y}_${prop.x}`);
        }
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
        if (
          (map[position].isHidden ||
            !floor.walkable ||
            map[position].h === 0) &&
          !newLockouts.includes(position)
        ) {
          newLockouts.push(position);
        }
      });

      this.lockouts = newLockouts;
    }
  }

  private handleAreaChange(newAreaId: string) {
    if (this.selectedAreaId !== newAreaId) {
      this.selectedAreaId = newAreaId;
      this.exits = this._gameEditorService.getExitsForCurrentArea();
      this.area = this._gameEditorService.getAreaById(this.selectedAreaId);
      this.refreshUIData();
    }
  }

  ngOnInit() {
    this.handleAreaChange(this._gameEditorService.getSelectedAreaId());
    this.subscriptions.push(
      this._gameEditorService.selectedExitIdObs.subscribe((data: string) => {
        this.selectedExitId = data;
        this.exits = this._gameEditorService.getExitsForCurrentArea();
        this.updateUiAfterExitSelection(data);
      })
    );
    this.subscriptions.push(
      this._gameEditorService.selectedAreaIdObs.subscribe((data: any) => {
        this.handleAreaChange(data);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public handleDeleteClick(id: string) {
    this._gameEditorService.deleteExit(id);
  }

  public updateUiAfterExitSelection(id: string) {
    const selectedExit = this.exits.find(exit => exit.id === id);
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
    this.inputExitLockType = selectedExit ? selectedExit.lock || '' : '';
    this.inputExitName = selectedExit ? selectedExit.name || '' : '';
    this.updateExitPositionLockouts();
    this.refreshUIData();
  }

  public handleEditClick(id: string) {
    if (this.selectedExitId === id) {
      this._gameEditorService.selectExit('');
      this.selectedExitId = '';
      return;
    }
    this._gameEditorService.selectExit(id);
    this.updateUiAfterExitSelection(id);
  }

  public handlePositionSelect(position: string) {
    this.inputExitPosition = position;
    this.handleExitInputChange();
  }

  public handleCreateClick() {
    const exit: GameAreaExit | null = this._gameEditorService.createExit();
    if (exit) {
      this.handleEditClick(exit.id);
    }
  }
  public handleToggleReciprocalExits() {
    this.isEnabledReciprocalExits = !this.isEnabledReciprocalExits;
  }
  public handleExitInputChange() {
    const selectedExit = this.exits.find(
      exit => exit.id === this.selectedExitId
    );
    const [y, x] = this.inputExitPosition.split('_');
    if (selectedExit) {
      const updatedExit: GameAreaExit = {
        ...selectedExit,
        id: this.selectedExitId,
        name: this.inputExitName,
        exitType: this.inputExitType,
        areaId: this.selectedAreaId,
        direction: this.inputExitDirection,
        destinationAreaId: this.inputExitDestination,
        destinationExitId: this.inputExitDestinationExit,
        x: +x,
        y: +y,
        lock: this.inputExitLockType ?? '',
      };

      this._gameEditorService.updateExit(
        updatedExit,
        this.isEnabledReciprocalExits
      );
      this.refreshUIData();
    }
  }
}
