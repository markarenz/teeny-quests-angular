import { Component, Input, Output, EventEmitter, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActionEffect,
  ActionTypeDefinition,
  SelectIUIOption,
} from '@app/features/main/interfaces/types';
import {
  ActionObjectType,
  ActionValueType,
  EventAction,
} from '@app/features/main/interfaces/enums';
import { CollapsibleCardComponent } from '@app/features/main/ui/components/collapsible-card/collapsible-card.component';
import { IconButtonComponent } from '@app/features/main/ui/components/icons/icon-button/icon-button.component';
import { AreaCellSelectorComponent } from '../area-cell-selector/area-cell-selector.component';
import { getLabelFromSlug } from '@app/features/main/utils';
import {
  actionTypeOptions,
  actionTypeDefinitions,
} from '@content/panelDeco-definitions';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';

@Component({
  selector: 'app-editor-input-actions',
  standalone: true,
  imports: [
    FormsModule,
    CollapsibleCardComponent,
    IconButtonComponent,
    AreaCellSelectorComponent,
  ],
  templateUrl: './editor-input-actions.component.html',
  styleUrl: './editor-input-actions.component.css',
})
export class EditorInputActionsComponent {
  @Input('title') title: string = 'Actions';
  @Input('actions') actions: ActionEffect[] = [];
  @Input('selectedAreaId') selectedAreaId: string = 'start';
  @Output('onActionsChange') onActionsChange = new EventEmitter<
    ActionEffect[]
  >();

  constructor(private _gameEditorService: GameEditorService) {}

  public selectedAction: ActionEffect | null = null;
  public selectedActionId: string | null = null;
  public actionTypeOptions = actionTypeOptions;
  public selectedActionTypeDefinition: ActionTypeDefinition | null = null;
  public areasListOptions: SelectIUIOption[] = [];

  public inputActionType: string = 'map-cell-height';
  public inputActionPosition: string = '0_0';
  public inputActionAreaId: string = this.selectedAreaId;
  public inputNumberValue: string = '0';

  public shouldShowPositionSelector: boolean = false;
  public shouldShowNumberInput: boolean = false;

  public refreshUIData() {
    if (this.selectedAction) {
      this.inputActionType = this.selectedAction.action;
      const def = actionTypeDefinitions[this.selectedAction.action];
      this.selectedActionTypeDefinition = def ? def : null;

      this.areasListOptions = this._gameEditorService.getAreasListOptions();
      this.shouldShowPositionSelector =
        def.objectType === ActionObjectType.MAP_CELL;
      if (this.shouldShowPositionSelector) {
        this.inputActionPosition =
          this.selectedAction.actionObject.identifier || '0_0';
      }
      if (def.valueType === ActionValueType.NUMBER) {
        this.shouldShowNumberInput = true;
        this.inputNumberValue = <string>this.selectedAction.actionValue;
      }
    }
  }

  public handleCreateClick() {
    const defaultNewAction: ActionEffect = {
      id: `action-${Date.now()}`,
      action: EventAction.UPDATE_MAP_CELL_HEIGHT,
      conditions: [],
      actionObject: {
        areaId: this.selectedAreaId,
        identifier: '0_0',
      },
      actionValue: 0,
    };
    const newActions = [...(this.actions ?? []), defaultNewAction];
    this.onActionsChange.emit(newActions);
  }

  public getActionLabel(action: ActionEffect): string {
    return getLabelFromSlug(action.action);
  }

  public handleActionInputChange() {
    if (!this.selectedActionId || !this.selectedAction) {
      return;
    }
    const updatedAction: ActionEffect = {
      ...this.selectedAction,
      id: this.selectedActionId,
      action: this.inputActionType as EventAction,
    };
    const newActions = (this.actions ?? []).map(action =>
      action.id === this.selectedActionId ? updatedAction : action
    );
    this.onActionsChange.emit(newActions);
  }

  public handleActionInputNumberChange() {
    if (!this.selectedActionId || !this.selectedAction) {
      return;
    }
    const updatedAction: ActionEffect = {
      ...this.selectedAction,
      actionValue: this.inputNumberValue || '0',
    };
    const newActions = (this.actions ?? []).map(action =>
      action.id === this.selectedActionId ? updatedAction : action
    );
    this.onActionsChange.emit(newActions);
  }

  public handlePositionSelect(positionKey: string) {
    if (!this.selectedActionId || !this.selectedAction) {
      return;
    }
    this.inputActionPosition = positionKey;
    const updatedAction: ActionEffect = {
      ...this.selectedAction,
      actionObject: {
        ...this.selectedAction.actionObject,
        identifier: positionKey,
      },
    };
    const newActions = (this.actions ?? []).map(action =>
      action.id === this.selectedActionId ? updatedAction : action
    );
    this.onActionsChange.emit(newActions);
  }

  public handleEditClick(actionId: string) {
    this.selectedAction =
      this.actions?.find(action => action.id === actionId) ?? null;
    this.selectedActionId = this.selectedAction ? actionId : null;
    this.refreshUIData();
  }
  public handleDeleteClick(actionId: string) {
    const newActions = (this.actions ?? []).filter(
      action => action.id !== actionId
    );
    this.onActionsChange.emit(newActions);
  }
}
