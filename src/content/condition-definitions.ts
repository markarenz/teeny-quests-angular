import {
  ConditionComparison,
  ConditionObjectType,
  ConditionValueType,
  EventConditionType,
} from '@app/features/main/interfaces/enums';
import { SelectUIOption } from '@app/features/main/interfaces/types';

export type ConditionDefinition = {
  id: string;
  name: string;
  conditionType: EventConditionType;
  objectType: ConditionObjectType;
  limitComparisons?: ConditionComparison[];
  valueType: ConditionValueType;
  objectInputLabel: string;
  valueInputLabel: string;
};

export const conditionDefinitions: { [key: string]: ConditionDefinition } = {
  inventory: {
    id: 'inventory',
    name: 'Inventory Item Quantity',
    conditionType: EventConditionType.INVENTORY,
    objectType: ConditionObjectType.INVENTORY_KEY,
    valueType: ConditionValueType.NUMBER,
    objectInputLabel: 'Inventory Item',
    valueInputLabel: 'Quantity',
  },
  flag: {
    id: 'flag',
    name: 'Flag Status',
    conditionType: EventConditionType.FLAG,
    objectType: ConditionObjectType.FLAG_ID,
    limitComparisons: [
      ConditionComparison.EQUALS,
      ConditionComparison.NOT_EQUALS,
    ],
    valueType: ConditionValueType.BOOLEAN,
    objectInputLabel: 'Flag ID',
    valueInputLabel: 'Flag Status',
  },
};

export const conditionOptions: SelectUIOption[] = Object.values(
  conditionDefinitions
).map(def => ({
  value: def.id,
  label: def.name,
}));

export const booleanOptions: SelectUIOption[] = [
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' },
];
