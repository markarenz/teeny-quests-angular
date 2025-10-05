import { utilCreateProp, utilUpdateProp, utilDeleteProp } from './prop-utils';
import gameMockData from '@app/features/editor/mocks/game.mock';
import { GameProp } from '@app/features/main/interfaces/types';

describe('utilDeleteProp', () => {
  it('should delete an prop', () => {
    const gameMock = JSON.parse(JSON.stringify(gameMockData));
    const propId = 'item-1';
    gameMock.content.areas['start'].props = [
      {
        id: propId,
        propType: 'torch',
        areaId: 'start',
        wall: 'south',
        x: 3,
        y: 5,
        h: 1,
        status: '',
        statusActions: {},
      },
    ];
    const selectedAreaId = 'start';
    const nextGame = utilDeleteProp({
      game: gameMock,
      selectedAreaId,
      propId,
    });
    expect(nextGame.content.areas[selectedAreaId].props.length).toEqual(0);
  });
});

describe('utilCreateProp', () => {
  it('creates a new default prop in an open spot', () => {
    const gameMock = JSON.parse(JSON.stringify(gameMockData));
    const { nextGame, newProp } = utilCreateProp({
      game: gameMock,
      selectedAreaId: 'start',
      lockouts: [],
    });
    expect(nextGame?.content.areas['start'].props.length).toBeGreaterThan(1);
    expect(newProp?.id).toBeTruthy();
  });
});

describe('utilUpdateProp', () => {
  it('should update an prop', () => {
    const gameMock = JSON.parse(JSON.stringify(gameMockData));
    const selectedAreaId = 'start';
    const propId = 'prop1';
    const mockUpdatedProp: GameProp = {
      id: propId,
      propType: 'switch',
      areaId: 'start',
      statusActions: {},
      wall: 'east',
      status: 'off',
      x: 5,
      y: 5,
      h: 1,
    };
    const nextGame = utilUpdateProp({
      game: gameMock,
      selectedAreaId,
      updatedProp: mockUpdatedProp,
    });

    expect(nextGame.content.areas[selectedAreaId].props[0]).toEqual(
      mockUpdatedProp
    );
  });
});
