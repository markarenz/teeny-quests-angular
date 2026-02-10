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
  {
    id: 'red-stone',
    name: 'Red Stone',
  },
  {
    id: 'blue-shine',
    name: 'Blue Crystal',
  },
];

export const wallOptionsData: SelectIUIOption[] = wallDefinitions.map(def => ({
  value: def.id,
  label: def.name,
}));
