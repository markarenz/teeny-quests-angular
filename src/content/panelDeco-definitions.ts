import { SelectIUIOption } from '@app/features/main/interfaces/types';
import {
  ActionObjectType,
  ActionValueType,
  EventAction,
} from '@app/features/main/interfaces/enums';
import { getLabelFromSlug } from '@app/features/main/utils';
import {
  PanelDecoDefinition,
  ActionTypeDefinition,
} from '@app/features/main/interfaces/types';

export const panelDecoDefinitions: { [key: string]: PanelDecoDefinition } = {
  torch: {
    id: 'torch',
    name: 'Torch',
    hasStatusEffects: false,
    canSetHeight: true,
    statuses: ['on', 'off'],
    isClickable: false,
  },
  switch: {
    id: 'switch',
    name: 'Switch',
    hasStatusEffects: true,
    statuses: ['on', 'off'],
    canSetHeight: false,
    isClickable: true,
  },
};

export const panelDecoOptions: SelectIUIOption[] = [
  { value: 'torch', label: 'Torch' },
  { value: 'switch', label: 'Switch' },
];

export const panelDecoWallOptions: SelectIUIOption[] = [
  {
    value: 'north',
    label: 'Right Wall',
  },
  {
    value: 'west',
    label: 'Left Wall',
  },
];

export const actionTypeOptions: SelectIUIOption[] = [
  {
    value: EventAction.UPDATE_MAP_CELL_HEIGHT,
    label: getLabelFromSlug(EventAction.UPDATE_MAP_CELL_HEIGHT),
  },
  {
    value: EventAction.UPDATE_MAP_CELL_FLOOR,
    label: getLabelFromSlug(EventAction.UPDATE_MAP_CELL_FLOOR),
  },
];

export const actionTypeDefinitions: { [key: string]: ActionTypeDefinition } = {
  [EventAction.UPDATE_MAP_CELL_HEIGHT]: {
    requiresAreaId: true,
    objectType: ActionObjectType.MAP_CELL,
    valueType: ActionValueType.NUMBER,
    numMin: 0,
    numMax: 24,
  },
  [EventAction.UPDATE_MAP_CELL_FLOOR]: {
    requiresAreaId: true,
    objectType: ActionObjectType.MAP_CELL,
    valueType: ActionValueType.STRING,
  },
};
