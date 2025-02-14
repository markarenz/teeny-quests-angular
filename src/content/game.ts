import { GameROM } from '../app/features/main/interfaces/types';

const game: GameROM = {
  id: 'abcd123',
  title: 'My first game',
  description: 'This is a simple game',
  itemStatus: 'active',
  userId: 'user123',
  username: 'User Name',
  content: {
    areas: {
      start: {
        id: 'start',
        name: 'Start',
        map: {
          '0,0': {
            x: 0,
            y: 0,
            h: 1,
            floor: 'default',
            wallEast: 'default',
            wallSouth: 'default',
          },
          '1,0': {
            x: 0,
            y: 1,
            h: 1,
            floor: 'default',
            wallEast: 'default',
            wallSouth: 'default',
          },
          '2,0': {
            x: 0,
            y: 2,
            h: 1,
            floor: 'default',
            wallEast: 'default',
            wallSouth: 'default',
          },
        },
        exits: [],
        items: [],
      },
    },
    events: [],
    flagValues: {},
    player: {
      areaId: 'start',
      x: 3,
      y: 3,
      inventory: {},
    },
  },
};
