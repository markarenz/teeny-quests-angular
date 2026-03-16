import {
  QuestAreaExit,
  QuestItem,
  QuestProp,
} from '@app/features/main/interfaces/types';

export const defaultExit: QuestAreaExit = {
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

export const defaultItem: QuestItem = {
  id: 'test',
  itemType: 'default',
  areaId: 'start',
  x: 2,
  y: 0,
  h: 1,
};

export const defaultProp: QuestProp = {
  id: 'test',
  propType: 'torch',
  areaId: 'start',
  wall: 'north',
  x: 2,
  y: 2,
  h: 1,
  statusActions: {},
  status: '',
};
