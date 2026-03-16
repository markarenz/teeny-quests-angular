import { QuestEvent, QuestROM } from '@app/features/main/interfaces/types';
import { v4 as uuidv4 } from 'uuid';

export const utilCreateEvent = ({
  game,
}: {
  game: QuestROM;
}): { nextGame: QuestROM | null; newEvent: QuestEvent | null } => {
  const nextGame = { ...game } as QuestROM;
  const newEventId = uuidv4();
  const newEvent: QuestEvent = {
    id: newEventId,
    name: `Event ${newEventId.slice(-5)}`,
    isUnidirectional: true,
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
  game: QuestROM;
  eventId: string;
}) => {
  const nextGame = { ...game } as QuestROM;
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
