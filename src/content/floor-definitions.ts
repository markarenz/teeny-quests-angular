import { SelectIUIOption } from '@app/features/main/interfaces/types';

export type FloorDefinition = {
  id: string;
  name: string;
  walkable: boolean;
};

export const floorDefinitions: { [key: string]: FloorDefinition } = {
  default: {
    id: 'default',
    name: 'Tile Light',
    walkable: true,
  },
  'tile-dark': {
    id: 'tile-dark',
    name: 'Tile Dark',
    walkable: true,
  },
  'wall-top': {
    id: 'wall-top',
    name: 'Wall Top',
    walkable: false,
  },
  water: {
    id: 'water',
    name: 'Water',
    walkable: false,
  },
  dirt: {
    id: 'dirt',
    name: 'Dirt',
    walkable: true,
  },
};

export const floorOptionsData: SelectIUIOption[] = [
  {
    value: 'default',
    label: 'Tile Light',
  },
  {
    value: 'tile-dark',
    label: 'Tile Dark',
  },
  {
    value: 'wall-top',
    label: 'Wall Top',
  },
  {
    value: 'water',
    label: 'Water',
  },
  {
    value: 'dirt',
    label: 'Dirt',
  },
];
