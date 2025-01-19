import { SelectIUIOption } from '@app/features/main/interfaces/types';

export type WallDefinition = {
  id: string;
  name: string;
};

export const wallDefinitions: WallDefinition[] = [
  {
    id: 'default',
    name: 'Stone',
  },
  {
    id: 'dark-stone',
    name: 'Dark Stone',
  },
  {
    id: 'cave',
    name: 'Cave Wall',
  },
];

export const wallOptionsData: SelectIUIOption[] = [
  {
    value: 'default',
    label: 'Stone',
  },
  {
    value: 'dark-stone',
    label: 'Dark Stone',
  },
  {
    value: 'cave',
    label: 'Cave Wall',
  },
];
