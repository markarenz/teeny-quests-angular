import game from '@content/game';
import { processTurnActions } from './turn-actions';
import gameMockData, {
  gameStateMockData,
} from '@app/features/editor/mocks/game.mock';
import {
  ActionEffect,
  GameROM,
  GameState,
} from '@app/features/main/interfaces/types';
import { EventAction } from '@app/features/main/interfaces/enums';

const mockAudioService: any = {
  playSound: () => {},
};

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
    const mockActions: ActionEffect[] = [
      {
        id: 'abcd1234',
        action: EventAction.UPDATE_MAP_CELL_HEIGHT,
        actionObject: {
          areaId: 'start',
          identifier: '1_1',
        },
        actionValue: 10,
      },
      {
        id: 'abcd1234',
        action: EventAction.UPDATE_MAP_CELL_FLOOR,
        actionObject: {
          areaId: 'start',
          identifier: '1_1',
        },
        actionValue: 'default',
      },
      {
        id: 'abcd1234',
        action: EventAction.SET_PROP_STATUS,
        actionObject: {
          areaId: 'start',
          identifier: 'prop1',
        },
        actionValue: 'on',
      },
    ];
    const { nextGameState, messages } = processTurnActions(
      gameStateMock,
      mockActions,
      mockAudioService
    );

    const updatedH = nextGameState.areas['start'].map['1_1'].h;
    expect(updatedH).toBe(10);

    const updatedFloor = nextGameState.areas['start'].map['1_1'].floor;
    expect(updatedFloor).toBe('default');

    const updatedPropStatus = nextGameState.areas['start'].props.find(
      p => p.id === 'prop1'
    )?.status;
    expect(updatedPropStatus).toBe('on');
    expect(messages.length).toBe(3);
  });
});
