import { Game } from '../app/features/main/interfaces/types';

const game: Game = {
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
        size: 3,
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
      },
    },
    items: {},
    events: [],
  },
};
