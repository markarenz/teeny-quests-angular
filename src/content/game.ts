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
            walkable: 1,
            cellType: 'floor',
            cellTheme: 'dungeon',
          },
          '1,0': {
            walkable: 1,
            cellType: 'floor',
            cellTheme: 'dungeon',
          },
          '2,0': {
            walkable: 1,
            cellType: 'floor',
            cellTheme: 'dungeon',
          },
        },
      },
    },
    items: {},
    events: [],
  },
};
