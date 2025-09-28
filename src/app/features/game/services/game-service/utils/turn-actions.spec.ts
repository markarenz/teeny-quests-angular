import game from '@content/game';
import {
  processTurnActions,
  processTurnAction,
  processActionSetMapCellHeight,
} from './turn-actions';
import gameMockData, {
  gameStateMockData,
} from '@app/features/editor/mocks/game.mock';
import {
  ActionEffect,
  GameROM,
  GameState,
} from '@app/features/main/interfaces/types';
import { EventAction } from '@app/features/main/interfaces/enums';

let gameMock: GameROM;
let gameStateMock: GameState;

describe('processTurnActions', () => {
  beforeEach(async () => {
    gameMock = await JSON.parse(
      JSON.stringify({
        ...gameMockData,
      })
    );
    gameStateMock = await JSON.parse(
      JSON.stringify({
        ...gameStateMockData,
      })
    );
  });

  it('should process multiple actions', () => {
    const initialMap = gameStateMock.areas['start'].map;
    const mockActions: ActionEffect[] = [
      {
        id: 'abcd1234',
        action: EventAction.UPDATE_MAP_CELL_HEIGHT,
        conditions: [],
        actionObject: {
          areaId: 'start',
          identifier: '1_1',
        },
        actionValue: 10,
      },
    ];
    const nextGameState = processTurnActions(gameStateMock, mockActions);
    const updatedH = nextGameState.areas['start'].map['1_1'].h;
    expect(updatedH).toBe(10);
  });
});
