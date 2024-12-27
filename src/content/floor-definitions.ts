export type FloorDefinition = {
  id: string;
  name: string;
};

export const floorDefinitions: FloorDefinition[] = [
  {
    id: 'default',
    name: 'Tile Light',
  },
  {
    id: 'tile-dark',
    name: 'Tile Dark',
  },
  {
    id: 'wall-top',
    name: 'Wall Top',
  },
  {
    id: 'water',
    name: 'Water',
  },
  {
    id: 'dirt',
    name: 'Dirt',
  },
];
