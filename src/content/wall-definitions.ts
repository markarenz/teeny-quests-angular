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
