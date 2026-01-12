import { GameEvent, GameROM } from '@app/features/main/interfaces/types';
import { v4 as uuidv4 } from 'uuid';

export const utilCreateEvent = ({
  game,
}: {
  game: GameROM;
}): { nextGame: GameROM | null; newEvent: GameEvent | null } => {
  const nextGame = { ...game } as GameROM;
  const newEventId = uuidv4();
  const newEvent: GameEvent = {
    id: newEventId,
    name: `Event ${newEventId.slice(-5)}`,
    conditions: [],
    actions: [],
  };
  const newEvents = [...nextGame.content.events, newEvent];
  nextGame.content.events = newEvents;
  return { nextGame, newEvent };
};

export const utilDeleteEvent = ({
  game,
  eventId,
}: {
  game: GameROM;
  eventId: string;
}) => {
  const nextGame = { ...game } as GameROM;
  const events = game.content.events;
  if (events) {
    const newEvents = events.filter(event => event.id !== eventId);
    nextGame.content.events = newEvents;
    if (newEvents) {
      return { nextGame };
    }
  }
  return { nextGame: null };
};
