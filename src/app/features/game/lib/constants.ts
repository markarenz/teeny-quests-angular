import { GameAreaExit, GameItem } from '@app/features/main/interfaces/types';

export const defaultExit: GameAreaExit = {
  id: 'test',
  exitType: 'default',
  areaId: '',
  direction: 'north',
  x: 2,
  y: 0,
  h: 1,
  destinationAreaId: '',
};

export const defaultItem: GameItem = {
  id: 'test',
  itemType: 'default',
  areaId: 'start',
  x: 2,
  y: 0,
  h: 1,
};
