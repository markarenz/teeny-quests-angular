import { SelectIUIOption } from '@app/features/main/interfaces/types';
import {
  ActionObjectType,
  ActionValueType,
  EventAction,
} from '@app/features/main/interfaces/enums';
import { getLabelFromSlug } from '@app/features/main/utils';
import {
  PropDefinition,
  ActionTypeDefinition,
} from '@app/features/main/interfaces/types';

export const propDecoDefinitions: { [key: string]: PropDefinition } = {
  torch: {
    id: 'torch',
    name: 'Torch',
    hasStatusEffects: false,
    canSetHeight: true,
    statuses: ['on', 'off'],
    isClickable: false,
    ambientLight: 0.5,
    lightPattern: 'half-circle-3',
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

export const propDecoOptions: SelectIUIOption[] = [
  { value: 'torch', label: 'Torch' },
  { value: 'switch', label: 'Switch' },
];

export const propDecoWallOptions: SelectIUIOption[] = [
  {
    value: 'north',
    label: 'Right Wall',
  },
  {
    value: 'west',
    label: 'Left Wall',
  },
];
