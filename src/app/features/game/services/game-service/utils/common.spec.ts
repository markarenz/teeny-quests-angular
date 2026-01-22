import { ExitType } from '@content/exit-definitions';
import { getLevelGoals } from './common';
import { GameROM } from '@app/features/main/interfaces/types';
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
