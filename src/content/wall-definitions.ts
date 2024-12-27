export type WallDefinition = {
  id: string;
  name: string;
  texture: string;
};

export const wallDefinitions: WallDefinition[] = [
  {
    id: 'default',
    name: 'Default',
    texture: 'wall-default.svg',
  },
  {
    id: 'stone',
    name: 'Stone',
    texture: 'wall-stone.svg',
  },
  {
    id: 'cave',
    name: 'Cave Wall',
    texture: 'wall-cave.svg',
  },
];
