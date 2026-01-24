import { ExitType } from '@content/exit-definitions';
import { calcScore, getLevelGoals } from './common';
import { gameStateMockData } from '@app/features/editor/mocks/game.mock';
import gameMockData from '@app/features/editor/mocks/game.mock';
import {
  ConditionComparison,
  EventAction,
  EventConditionType,
} from '@app/features/main/interfaces/enums';
describe('getLevelGoals', () => {
  it('should return correct level goals string', () => {
    const mockGameROM = structuredClone(gameMockData);
    mockGameROM.content.areas['start'].exits[0].exitType = ExitType.GAME_END;
    mockGameROM.content.events = [
      {
        id: 'event1',
        name: 'Event 1',
        isUnidirectional: true,
        actions: [
          {
            id: 'action1',
            action: EventAction.SET_FLAG,
            actionObject: { identifier: 'gameCompleted' },
            actionValue: true,
          },
        ],
        conditions: [
          {
            id: 'cond1',
            conditionType: EventConditionType.INVENTORY,
            identifier: 'gold',
            value: 5,
            comparison: ConditionComparison.GREATER_THAN_OR_EQUALS,
          },
        ],
      },
    ];
    const result = getLevelGoals(mockGameROM);
    expect(result).toBe('Collect 5 Gold Coins -or- explore and find the exit.');
  });
  it('should return correct level goals string - single inventory item', () => {
    const mockGameROM = structuredClone(gameMockData);
    mockGameROM.content.events = [
      {
        id: 'event1',
        name: 'Event 1',
        isUnidirectional: true,
        actions: [
          {
            id: 'action1',
            action: EventAction.SET_FLAG,
            actionObject: { identifier: 'gameCompleted' },
            actionValue: true,
          },
        ],
        conditions: [
          {
            id: 'cond1',
            conditionType: EventConditionType.INVENTORY,
            identifier: 'key-silver',
            value: 1,
            comparison: ConditionComparison.GREATER_THAN_OR_EQUALS,
          },
        ],
      },
    ];
    const result = getLevelGoals(mockGameROM);
    expect(result).toBe('Find a Silver Key.');
  });
});

describe('calcScore', () => {
  it('should calculate score based on inventory and flags', () => {
    const mockGameROM = structuredClone(gameMockData);
    mockGameROM.content.flags = [
      { id: 'flag1', name: 'Flag 1', scoreValue: 20 },
      { id: 'flag2', name: 'Flag 2', scoreValue: 30 },
    ];
    const mockGameState = structuredClone(gameStateMockData);
    mockGameState.player.inventory = {
      gold: 10,
      'key-silver': 1,
    };
    mockGameState.flagValues = {
      flag1: true,
      flag2: false,
    };
    mockGameState.numTurns = 5;
    const score = calcScore(mockGameState, mockGameROM);
    // Assuming gold has a score value of 1 and key-silver has a score value of 10
    // gold (10) + key-silver (5) + flag1 (20) - numTurns (5) = 30
    expect(score).toBe(30);
  });
});
