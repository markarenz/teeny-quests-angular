import {
  GameAreaExit,
  GameItem,
  GamePanelDeco,
} from '@app/features/main/interfaces/types';

export const defaultExit: GameAreaExit = {
  id: 'test',
  exitType: 'default',
  areaId: '',
  direction: 'north',
  x: 2,
  y: 0,
  h: 1,
  destinationAreaId: '',
  destinationExitId: '',
};

export const defaultItem: GameItem = {
  id: 'test',
  itemType: 'default',
  areaId: 'start',
  x: 2,
  y: 0,
  h: 1,
};

export const defaultPanelDeco: GamePanelDeco = {
  id: 'test',
  panelDecoType: 'torch',
  areaId: 'start',
  wall: 'north',
  x: 2,
  y: 2,
  h: 1,
  statusActions: {},
  status: '',
};
