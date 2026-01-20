import {
  ActionObjectType,
  ActionValueType,
} from '@app/features/main/interfaces/enums';
import { SelectIUIOption } from '@app/features/main/interfaces/types';

export type ActionDefinition = {
  id: string;
  name: string;
  objectType: string;
  valueType: string;
  showAreaId: boolean;
  requiresAreaId: boolean;
};

export const actionDefinitions: { [key: string]: ActionDefinition } = {
  'update-map-cell-height': {
    id: 'update-map-cell-height',
    name: 'Map Cell: Set Height',
    objectType: ActionObjectType.MAP_CELL,
    showAreaId: true,
    valueType: ActionValueType.CELL_HEIGHT,
    requiresAreaId: true,
  },
  'update-map-cell-floor': {
    id: 'update-map-cell-floor',
    name: 'Map Cell: Set Floor Type',
    objectType: ActionObjectType.MAP_CELL,
    showAreaId: true,
    valueType: ActionValueType.FLOOR_TYPE,
    requiresAreaId: true,
  },
  'set-prop-status': {
    id: 'set-prop-status',
    name: 'Prop: Set Status',
    objectType: ActionObjectType.PROP_ID,
    showAreaId: true,
    valueType: ActionValueType.PROP_STATUS,
    requiresAreaId: true,
  },
  'set-flag': {
    id: 'set-flag',
    name: 'Set Flag',
    objectType: ActionObjectType.FLAG_ID,
    showAreaId: false,
    valueType: ActionValueType.BOOLEAN,
    requiresAreaId: false,
  },
};

export const actionOptions: SelectIUIOption[] = Object.values(
  actionDefinitions
).map(def => ({
  value: def.id,
  label: def.name,
}));
