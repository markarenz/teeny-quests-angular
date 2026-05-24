import questMockData, {
  questMockDataFlatStart,
} from '@app/features/editor/mocks/game.mock';
import {
  utilCreateActor,
  utilDeleteActor,
  utilUpdateActor,
} from './actor-utils';
import { Direction } from '@app/features/main/interfaces/enums';
import { getPositionKeysForGridSize } from '@app/features/main/utils';

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

  [
    {
      lockoutExclude: '0_4',
      expectedDescription: Direction.SOUTH,
      success: true,
    },
    {
      lockoutExclude: '6_4',
      expectedDescription: Direction.NORTH,
      success: true,
    },
    {
      lockoutExclude: '4_0',
      expectedDescription: Direction.EAST,
      success: true,
    },
    {
      lockoutExclude: '4_6',
      expectedDescription: Direction.WEST,
      success: true,
    },
    {
      lockoutExclude: '7_7',
      expectedDescription: Direction.NORTH,
      success: false,
    },
  ].forEach(({ lockoutExclude, expectedDescription, success }) => {
    it(`creates a new actor facing ${expectedDescription}`, () => {
      const gameMock = JSON.parse(JSON.stringify(questMockDataFlatStart));
      const lockouts: string[] = getPositionKeysForGridSize().filter(
        key => key !== lockoutExclude
      );
      const { nextGame, newActor } = utilCreateActor({
        game: gameMock,
        selectedAreaId: 'start',
        lockouts,
      });
      if (success) {
        expect(nextGame?.content.areas['start'].actors.length).toBeGreaterThan(
          0
        );
        expect(newActor?.id).toBeTruthy();
        expect(newActor?.facing).toEqual(expectedDescription);
      } else {
        expect(nextGame).toBeNull();
        expect(newActor).toBeNull();
      }
    });
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

describe('utilUpdateActor', () => {
  it('updates actor map height based on new x/y position', () => {
    const gameMock = JSON.parse(JSON.stringify(questMockData));
    const selectedAreaId = 'start';
    const existingActor = gameMock.content.areas[selectedAreaId].actors[0];
    const updatedActor = {
      ...existingActor,
      x: 1,
      y: 1,
    };

    const nextGame = utilUpdateActor({
      game: gameMock,
      updatedActor,
      selectedAreaId,
    });

    const nextActor = nextGame.content.areas[selectedAreaId].actors.find(
      actor => actor.id === existingActor.id
    );
    expect(nextActor).toBeTruthy();
    expect(nextActor?.x).toEqual(1);
    expect(nextActor?.y).toEqual(1);
    expect(nextActor?.h).toEqual(4);
  });

  it('clamps actor health to actor definition maxHealth', () => {
    const gameMock = JSON.parse(JSON.stringify(questMockData));
    const selectedAreaId = 'start';
    const existingActor = gameMock.content.areas[selectedAreaId].actors[0];
    const updatedActor = {
      ...existingActor,
      health: 999,
    };

    const nextGame = utilUpdateActor({
      game: gameMock,
      updatedActor,
      selectedAreaId,
    });

    const nextActor = nextGame.content.areas[selectedAreaId].actors.find(
      actor => actor.id === existingActor.id
    );
    expect(nextActor).toBeTruthy();
    expect(nextActor?.health).toEqual(2);
  });
});
