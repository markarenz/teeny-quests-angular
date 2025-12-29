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
    statusMessages: {
      on: {
        title: 'Torch Lit',
        message: 'The torch is now lit, illuminating the surrounding area.',
        messageType: 'info',
        sound: 'torch-on',
      },
      off: {
        title: 'Torch Extinguished',
        message: 'The torch has been extinguished, darkening the area.',
        messageType: 'info',
        sound: 'torch-on',
      },
    },
  },
  switch: {
    id: 'switch',
    name: 'Switch',
    hasStatusEffects: true,
    statuses: ['on', 'off'],
    canSetHeight: false,
    isClickable: true,
    sound: 'switch',
    // No status messages for switches, only message on resulting actions
  },
  banner: {
    id: 'banner',
    name: 'Banner',
    hasStatusEffects: true,
    statuses: ['red', 'blue', 'green'],
    canSetHeight: false,
    isClickable: true,
    sound: 'bounce',
  },
};

export const propDecoOptions: SelectIUIOption[] = [
  { value: 'torch', label: 'Torch' },
  { value: 'switch', label: 'Switch' },
  { value: 'banner', label: 'Banner' },
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
