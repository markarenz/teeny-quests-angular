import questMockData from '@app/features/editor/mocks/game.mock';
import { utilCreateActor, utilDeleteActor } from './actor-utils';

describe('utilCreateActor', () => {
  it('creates a new actor in an open spot', () => {
    const gameMock = JSON.parse(JSON.stringify(questMockData));
    const { nextGame, newActor } = utilCreateActor({
      game: gameMock,
      selectedAreaId: 'start',
      lockouts: [],
    });
    expect(nextGame?.content.areas['start'].actors.length).toBeGreaterThan(0);
    expect(newActor?.id).toBeTruthy();
  });
});

describe('utilDeleteActor', () => {
  it('should delete an actor', () => {
    const gameMock = JSON.parse(JSON.stringify(questMockData));
    const selectedAreaId = 'start';
    const actorId = 'actor-1';
    const nextGame = utilDeleteActor({
      game: gameMock,
      selectedAreaId,
      actorId,
    });
    expect(nextGame?.content.areas[selectedAreaId].actors.length).toEqual(0);
  });
});
