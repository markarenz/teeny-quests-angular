import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  GameEventActionCondition,
  SelectIUIOption,
} from '@app/features/main/interfaces/types';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { IconButtonComponent } from '@app/features/main/ui/components/icons/icon-button/icon-button.component';
import { CollapsibleCardComponent } from '@app/features/main/ui/components/collapsible-card/collapsible-card.component';
import { logger } from '@app/features/main/utils/logger';
import { itemKeyOptions } from '@content/item-definitions';
import {
  ConditionComparison,
  ConditionObjectType,
  ConditionValueType,
  EventConditionType,
} from '@app/features/main/interfaces/enums';
import {
  ConditionDefinition,
  conditionOptions,
  conditionDefinitions,
  booleanOptions,
} from '@content/condition-definitions';
import { getLabelFromSlug } from '@app/features/main/utils';

@Component({
  selector: 'app-editor-input-conditions',
  standalone: true,
  imports: [FormsModule, CollapsibleCardComponent, IconButtonComponent],
  templateUrl: './editor-input-conditions.component.html',
  styleUrl: './editor-input-conditions.component.css',
})
export class EditorInputConditionsComponent {
  @Input('title') title: string = 'Conditions';
  @Input('conditions') conditions: GameEventActionCondition[] = [];
  @Output('onConditionsChange') onConditionsChange = new EventEmitter<
    GameEventActionCondition[]
  >();

  constructor(private _gameEditorService: GameEditorService) {}

  public selectedCondition: GameEventActionCondition | null = null;
  public selectedConditionId: string | null = null;
  public conditionTypeOptions = conditionOptions;
  public inventoryKeyOptions = itemKeyOptions;
  public selectedConditionTypeDefinition: ConditionDefinition | null = null;
  public valueOptions: SelectIUIOption[] = [];
  public objectIdentifierInputLabel: string = 'Object Identifier';
  public valueInputLabel: string = 'Value';
  public objectIdentifierOptions: SelectIUIOption[] = [];

  public inputConditionType: string = 'map-cell-height';
  public inputConditionObjectId: string = '';
  public inputConditionValue: string = '';
  public inputConditionIsUnidirectional: boolean = false;

  public refreshUIData() {
    if (this.selectedCondition) {
      this.inputConditionType = this.selectedCondition.conditionType;
      this.inputConditionObjectId = this.selectedCondition.identifier;
      this.inputConditionValue = String(this.selectedCondition.value);

      const def = conditionDefinitions[this.selectedCondition.conditionType];
      if (!def) {
        logger({
          message: `No action definition found for action type: ${this.selectedCondition.conditionType}`,
          type: 'error',
        });
        return;
      }

      this.selectedConditionTypeDefinition = def;
      this.objectIdentifierInputLabel = def.objectInputLabel;
      this.valueInputLabel = def.valueInputLabel;

      const objectInputOptionsMap = {
        [ConditionObjectType.INVENTORY_KEY]: this.inventoryKeyOptions,
        [ConditionObjectType.FLAG_ID]: [], // TODO: get a list of flags
      };
      this.objectIdentifierOptions =
        objectInputOptionsMap[def.objectType] || [];

      // Set value options based on value type
      if (def.valueType === ConditionValueType.BOOLEAN) {
        this.valueOptions = booleanOptions;
      } else {
        this.valueOptions = [];
      }
    }
  }

  public getConditionLabel(action: GameEventActionCondition): string {
    return getLabelFromSlug(action.conditionType);
  }

  public handleCreateClick() {
    const defaultNewAction: GameEventActionCondition = {
      id: `action-${Date.now()}`,
      conditionType: EventConditionType.INVENTORY,
      identifier: 'gold',
      comparison: ConditionComparison.GREATER_THAN,
      value: 100,
    };
    const newConditions = [...(this.conditions ?? []), defaultNewAction];
    this.conditions = newConditions;
    this.onConditionsChange.emit(newConditions);
  }

  public handleEditClick(conditionId: string) {
    if (this.selectedConditionId === conditionId) {
      this.selectedCondition = null;
      this.selectedConditionId = null;
      return;
    }

    this.selectedCondition =
      this.conditions?.find(condition => condition.id === conditionId) ?? null;
    this.selectedConditionId = this.selectedCondition ? conditionId : null;
    this.refreshUIData();
  }

  public handleDeleteClick(conditionId: string) {
    const newConditions = (this.conditions ?? []).filter(
      condition => condition.id !== conditionId
    );
    this.conditions = newConditions;
    this.onConditionsChange.emit(newConditions);
  }
  public handleConditionInputChange() {
    if (!this.selectedCondition) {
      return;
    }
    this.selectedCondition.identifier = this.inputConditionObjectId;
    this.selectedCondition.value =
      this.selectedConditionTypeDefinition?.valueType ===
      ConditionValueType.NUMBER
        ? Number(this.inputConditionValue)
        : this.inputConditionValue === 'true'
          ? true
          : this.inputConditionValue === 'false'
            ? false
            : this.inputConditionValue;
    this.conditions =
      this.conditions?.map(condition =>
        condition.id === this.selectedCondition!.id
          ? this.selectedCondition!
          : condition
      ) || [];
    this.onConditionsChange.emit(this.conditions);
  }

  public handleConditionTypeChange() {
    if (!this.selectedCondition) {
      return;
    }
    this.selectedCondition.conditionType = this.inputConditionType;
    this.refreshUIData();
  }
}
