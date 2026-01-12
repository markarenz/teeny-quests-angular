import { utilCreateEvent, utilDeleteEvent } from './event-utils';
import { GameEvent, GameROM } from '@app/features/main/interfaces/types';

describe('Event Utils', () => {
  let mockGame: GameROM;

  beforeEach(() => {
    mockGame = {
      content: {
        events: [
          { id: 'event-1', name: 'Event 1', conditions: [], actions: [] },
          { id: 'event-2', name: 'Event 2', conditions: [], actions: [] },
        ],
        areas: {},
      },
    } as unknown as GameROM;
  });

  describe('utilCreateEvent', () => {
    it('should create a new event and add it to the game', () => {
      const { nextGame, newEvent } = utilCreateEvent({ game: mockGame });

      expect(nextGame).not.toBeNull();
      expect(newEvent).not.toBeNull();
      expect(nextGame?.content.events.length).toBe(3);
      expect(nextGame?.content.events).toContain(newEvent);
    });
  });

  describe('utilDeleteEvent', () => {
    it('should delete the specified event from the game', () => {
      const { nextGame } = utilDeleteEvent({
        game: mockGame,
        eventId: 'event-1',
      });

      expect(nextGame).not.toBeNull();
      expect(nextGame?.content.events.length).toBe(1);
      expect(
        nextGame?.content.events.find(event => event.id === 'event-1')
      ).toBeUndefined();
    });

    it('should return unchanged events if event ID is invalid or not found', () => {
      const { nextGame } = utilDeleteEvent({
        game: mockGame,
        eventId: 'non-existent-event',
      });
      // We do not delete anything, but nextGame is still returned
      expect(nextGame?.content.events.length).toEqual(2);
    });

    it('should return undefined if events do not exist on game content', () => {
      const mockGameNoEvents = { ...mockGame };
      // @ts-expect-error -- testing missing events
      mockGameNoEvents.content.events = undefined;
      const { nextGame } = utilDeleteEvent({
        game: mockGame,
        eventId: 'non-existent-event',
      });
      // We do not delete anything, but nextGame is still returned
      expect(nextGame?.content.events).toBeUndefined();
    });
  });
});
