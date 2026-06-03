import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActionEffect,
  SelectUIOption,
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
import { propDecoDefinitions } from '@content/prop-definitions';
import {
  ActionDefinition,
  actionDefinitions,
  actionOptions,
} from '@content/action-definitions';
import { booleanOptions } from '@content/flags';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { floorOptionsData } from '@content/floor-definitions';
import { maxAreaCellHeight } from '@config/index';
import { logger } from '@app/features/main/utils/logger';

@Component({
  selector: 'app-editor-input-actions',
  imports: [
    FormsModule,
    CollapsibleCardComponent,
    IconButtonComponent,
    AreaCellSelectorComponent,
  ],
  templateUrl: './editor-input-actions.component.html',
  styleUrl: './editor-input-actions.component.css',
  standalone: true,
})
export class EditorInputActionsComponent {
  @Input('title') title: string = 'Actions';
  @Input('parentId') parentId: string = '';
  @Input('actions') actions: ActionEffect[] = [];
  @Input('selectedAreaId') selectedAreaId: string = 'start';
  @Output('onActionsChange') onActionsChange = new EventEmitter<
    ActionEffect[]
  >();

  constructor(private _gameEditorService: GameEditorService) {}

  public selectedAction: ActionEffect | null = null;
  public selectedActionId: string | null = null;
  public actionTypeOptions = actionOptions;
  public selectedActionTypeDefinition: ActionDefinition | null = null;
  public areasListOptions: SelectUIOption[] = [];
  public objectIdentifierOptions: SelectUIOption[] = [];
  public valueOptions: SelectUIOption[] = [];
  public booleanOptions: SelectUIOption[] = booleanOptions;
  public flagIdOptions: SelectUIOption[] = [];
  public objectIdentifierInputLabel: string = 'Object Identifier';
  public valueInputLabel: string = 'Value';

  public inputActionType: string = 'map-cell-height';
  public inputActionAreaId: string = this.selectedAreaId;
  public inputActionObjectId: string = '';
  public inputActionValue: string = '';
  public shouldShowPositionSelector: boolean = false;

  ngOnInit() {
    this.flagIdOptions = this._gameEditorService.getFlagsListOptions();
  }
  public refreshUIData() {
    if (this.selectedAction) {
      this.inputActionType = this.selectedAction.action;
      this.inputActionAreaId =
        this.selectedAction.actionObject.areaId || this.selectedAreaId;
      const def = actionDefinitions[this.selectedAction.action];
      if (!def) {
        logger({
          message: `No action definition found for action type: ${this.selectedAction.action}`,
          type: 'error',
        });
        return;
      }
      this.selectedActionTypeDefinition = def ?? null;
      this.areasListOptions = this._gameEditorService.getAreasListOptions();

      this.inputActionObjectId =
        this.selectedAction.actionObject.identifier ?? '';
      this.inputActionValue = <string>this.selectedAction.actionValue ?? '';

      this.valueInputLabel = getLabelFromSlug(def.valueType || '');
      this.objectIdentifierInputLabel = getLabelFromSlug(def.objectType || '');

      this.shouldShowPositionSelector =
        def.objectType === ActionObjectType.MAP_CELL;

      this.updateHighlightedCell();

      // set object options based on type and sub type
      if (!this.shouldShowPositionSelector) {
        if (def.objectType === ActionObjectType.PROP_ID) {
          this.objectIdentifierOptions =
            this._gameEditorService.getPropsListOptions(this.inputActionAreaId);
        }
      }
      if (def.objectType === ActionObjectType.FLAG_ID) {
        this.objectIdentifierOptions = this.flagIdOptions;
      }
      // set value options based on type and sub type
      if (def.valueType === ActionValueType.FLOOR_TYPE) {
        this.valueOptions = floorOptionsData;
      }
      if (def.valueType === ActionValueType.CELL_HEIGHT) {
        this.valueOptions = Array.from(
          { length: maxAreaCellHeight + 1 },
          (_, i) => ({
            value: i.toString(),
            label: i.toString(),
          })
        );
      }
      if (def.valueType === ActionValueType.PROP_STATUS) {
        const prop = this._gameEditorService.getPropById(
          this.inputActionObjectId,
          this.inputActionAreaId
        );
        if (prop) {
          const propDef = propDecoDefinitions[prop.propType];
          if (propDef && propDef.statuses) {
            this.valueOptions = propDef.statuses.map(status => ({
              value: status,
              label: getLabelFromSlug(status),
            }));
          }
        }
      }
      if (def.valueType === ActionValueType.BOOLEAN) {
        this.valueOptions = booleanOptions;
      }
    }
  }

  public handleCreateClick() {
    const defaultNewAction: ActionEffect = {
      id: `action-${Date.now()}`,
      action: EventAction.UPDATE_MAP_CELL_HEIGHT,
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

  public handleActionTypeChange() {
    if (!this.selectedActionId || !this.selectedAction) {
      return;
    }
    this.selectedAction = {
      ...this.selectedAction,
      action: this.inputActionType as EventAction,
    };

    this.handleActionInputChange();
  }
  public handleActionInputChange() {
    if (!this.selectedActionId || !this.selectedAction) {
      return;
    }
    const updatedAction: ActionEffect = {
      ...this.selectedAction,
      id: this.selectedActionId,
      action: this.inputActionType as EventAction,
      actionObject: {
        ...this.selectedAction.actionObject,
        areaId: this.inputActionAreaId,
        identifier: this.inputActionObjectId,
      },
      actionValue: this.inputActionValue,
    };
    const newActions = (this.actions ?? []).map(action =>
      action.id === this.selectedActionId ? updatedAction : action
    );
    this.selectedAction = updatedAction;
    this.onActionsChange.emit(newActions);
    this.refreshUIData();
  }

  public handlePositionSelect(positionKey: string) {
    if (!this.selectedActionId || !this.selectedAction) {
      return;
    }
    this.inputActionObjectId = positionKey;
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
    this.updateHighlightedCell();
    this.onActionsChange.emit(newActions);
  }

  public handleEditClick(actionId: string) {
    if (this.selectedActionId === actionId) {
      this.selectedAction = null;
      this.selectedActionId = null;
      return;
    }

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
  updateHighlightedCell() {
    if (this.shouldShowPositionSelector) {
      this._gameEditorService.setHighlightedCell(
        this.inputActionObjectId &&
          this.selectedAction &&
          this.selectedAction.action === EventAction.UPDATE_MAP_CELL_HEIGHT &&
          this.inputActionAreaId === this.selectedAreaId
          ? this.inputActionObjectId
          : ''
      );
    }
  }

  // when parent ID changes, reset selectedActionId
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parentId']) {
      this.selectedAction = null;
      this.selectedActionId = null;
      this._gameEditorService.setHighlightedCell('');
    }
  }
}
