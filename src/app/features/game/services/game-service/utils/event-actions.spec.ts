import { processEvents, parseConditionComparisonNumber } from './event-actions';
import { AudioService } from '@app/features/main/services/audio/audio-service.service';
import { MessageService } from '../../message/message.service';
import {
  ConditionComparison,
  EventAction,
} from '@app/features/main/interfaces/enums';
import {
  GameEvent,
  GameROM,
  GameState,
} from '@app/features/main/interfaces/types';
import { gameStateMockData } from '@app/features/editor/mocks/game.mock';
import gameMockData from '@app/features/editor/mocks/game.mock';

describe('Event Actions', () => {
  let mockAudioService: AudioService;
  let mockMessageService: MessageService;
  let mockGameROM = structuredClone(gameMockData);
  let mockGameState = structuredClone(gameStateMockData);

  const mockEvent: GameEvent = {
    id: 'event1',
    isUnidirectional: true,
    name: 'Test Event',
    conditions: [
      {
        id: 'condition-1',
        conditionType: 'inventory',
        identifier: 'gold',
        comparison: ConditionComparison.GREATER_THAN,
        value: 100,
      },
    ],
    actions: [
      {
        id: 'action-1',
        action: EventAction.SET_PROP_STATUS,
        actionObject: {
          areaId: 'start',
          identifier: 'prop1',
        },
        actionValue: 'on',
      },
    ],
  };

  beforeEach(() => {
    mockGameROM = structuredClone(gameMockData);
    mockGameState = structuredClone(gameStateMockData);
    mockGameState.player.inventory = { gold: 150 };
    mockGameROM.content.events = [mockEvent];
    mockAudioService = jasmine.createSpyObj('AudioService', ['playSound']);
    mockMessageService = jasmine.createSpyObj('MessageService', [
      'showMessage',
    ]);
  });
  afterEach(() => {});
  describe('processEvents', () => {
    it('should process events without errors', () => {
      const mockROMlocal = structuredClone(mockGameROM);
      const mockGameStateLocal = structuredClone(mockGameState);
      expect(() =>
        processEvents(
          mockGameStateLocal,
          mockROMlocal,
          mockAudioService,
          mockMessageService
        )
      ).not.toThrow();
      // Expect the action to have been triggered
      const prop = mockGameStateLocal.areas['start'].props.find(
        p => p.id === 'prop1'
      );
      expect(prop?.status).toBe('on');
    });
    it('should not check conditions if events are not present', () => {
      const mockROMlocal = structuredClone(mockGameROM);
      const mockGameStateLocal = structuredClone(mockGameState);
      // @ts-expect-error -- testing with no events
      mockROMlocal.content.events = undefined;
      expect(() =>
        processEvents(
          mockGameStateLocal,
          mockROMlocal,
          mockAudioService,
          mockMessageService
        )
      ).not.toThrow();
      // Expect the action not to have been triggered
      const prop = mockGameStateLocal.areas['start'].props.find(
        p => p.id === 'prop1'
      );
      expect(prop?.status).not.toBe('on');
    });

    it('should not trigger actions if conditions are not met', () => {
      const mockROMlocal = <GameROM>JSON.parse(JSON.stringify(mockGameROM));
      const mockGameStateLocal = <GameState>(
        JSON.parse(JSON.stringify(mockGameState))
      );
      mockGameStateLocal.player.inventory = { gold: 0 }; // Not enough gold to meet condition
      expect(() =>
        processEvents(
          mockGameStateLocal,
          mockROMlocal,
          mockAudioService,
          mockMessageService
        )
      ).not.toThrow();
      // Expect the action not to have been triggered
      const prop = mockGameStateLocal.areas['start'].props.find(
        p => p.id === 'prop1'
      );
      expect(prop?.status).not.toBe('on');
    });
    it('should not trigger action if conditions are met but event is unidirectional and already processed', () => {
      const mockROMlocal = structuredClone(mockGameROM);
      const mockGameStateLocal = structuredClone(mockGameState);
      mockGameStateLocal.flagValues['event_' + mockEvent.id] = true; // Mark event as already processed
      expect(() =>
        processEvents(
          mockGameStateLocal,
          mockROMlocal,
          mockAudioService,
          mockMessageService
        )
      ).not.toThrow();
      // Expect the action to have been triggered
      const prop = mockGameStateLocal.areas['start'].props.find(
        p => p.id === 'prop1'
      );
      expect(prop?.status).not.toBe('on');
    });
  });

  describe('parseConditionComparisonNumber', () => {
    it('should correctly parse comparison results', () => {
      expect(
        parseConditionComparisonNumber(10, 5, ConditionComparison.GREATER_THAN)
      ).toBeTrue();
      expect(
        parseConditionComparisonNumber(5, 10, ConditionComparison.LESS_THAN)
      ).toBeTrue();
      expect(
        parseConditionComparisonNumber(5, 5, ConditionComparison.EQUALS)
      ).toBeTrue();
      expect(
        parseConditionComparisonNumber(5, 10, ConditionComparison.NOT_EQUALS)
      ).toBeTrue();
      expect(
        parseConditionComparisonNumber(
          5,
          5,
          ConditionComparison.GREATER_THAN_OR_EQUALS
        )
      ).toBeTrue();
      expect(
        parseConditionComparisonNumber(
          5,
          5,
          ConditionComparison.LESS_THAN_OR_EQUALS
        )
      ).toBeTrue();
    });
  });
});
