import { SelectIUIOption } from '@app/features/main/interfaces/types';

export type PanelDecoDefinition = {
  id: string;
  name: string;
  canSetHeight: boolean;
  hasStatusEffects: boolean;
  statuses?: string[];
};

export const panelDecoDefinitions: { [key: string]: PanelDecoDefinition } = {
  torch: {
    id: 'torch',
    name: 'Torch',
    hasStatusEffects: false,
    canSetHeight: true,
  },
  switch: {
    id: 'switch',
    name: 'Switch',
    hasStatusEffects: true,
    statuses: ['on', 'off'],
    canSetHeight: false,
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
