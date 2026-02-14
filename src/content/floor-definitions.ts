import { SelectIUIOption } from '@app/features/main/interfaces/types';

export enum FloorTileType {
  DEFAULT = 'default',
  SINGLE = 'single',
}
export type FloorDefinition = {
  id: string;
  name: string;
  walkable: boolean;
  tileType?: FloorTileType;
  flipOdds?: boolean;
};

export const floorDefinitions: { [key: string]: FloorDefinition } = {
  default: {
    id: 'default',
    name: 'Tile Light',
    walkable: true,
    tileType: FloorTileType.DEFAULT,
  },
  'tile-dark': {
    id: 'tile-dark',
    name: 'Tile Dark',
    walkable: true,
    tileType: FloorTileType.DEFAULT,
  },
  'wall-top': {
    id: 'wall-top',
    name: 'Wall Top',
    walkable: false,
    tileType: FloorTileType.DEFAULT,
  },
  water: {
    id: 'water',
    name: 'Water',
    walkable: false,
    tileType: FloorTileType.DEFAULT,
  },
  dirt: {
    id: 'dirt',
    name: 'Dirt',
    walkable: true,
    tileType: FloorTileType.DEFAULT,
  },
  'stone-dark': {
    id: 'stone-dark',
    name: 'Dark Stone',
    walkable: true,
    tileType: FloorTileType.SINGLE,
  },
  parquet: {
    id: 'parquet',
    name: 'Parquet Floor',
    walkable: true,
    tileType: FloorTileType.SINGLE,
    flipOdds: true,
  },
  roof: {
    id: 'roof',
    name: 'Wall Top',
    walkable: false,
    tileType: FloorTileType.SINGLE,
  },
  spikes: {
    id: 'spikes',
    name: 'Spikes',
    walkable: false,
    tileType: FloorTileType.SINGLE,
  },
};

export const floorOptionsData: SelectIUIOption[] = Object.values(
  floorDefinitions
).map(floor => ({
  value: floor.id,
  label: floor.name,
}));
