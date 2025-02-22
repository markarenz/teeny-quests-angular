import { utilCreateExit, utilDeleteExit, utilUpdateExit } from './exits-utils';
import { getPositionKeysForGridSize } from '@main/utils';
import gameMockData from '@app/features/editor/mocks/game.mock.json';

describe('utilCreateExit', () => {
  it('creates a new exit in an open spot- facing north', () => {
    const gameMock = JSON.parse(JSON.stringify(gameMockData));
    const { nextGame, newExit } = utilCreateExit({
      game: gameMock,
      selectedAreaId: 'start',
    });
    expect(nextGame?.content.areas['start'].exits.length).toBeGreaterThan(1);
    expect(newExit?.id).toBeTruthy();
  });

  it('Unable to create a new exit since map is full', () => {
    const gameMock = JSON.parse(JSON.stringify(gameMockData));
    const positionKeys = getPositionKeysForGridSize();
    const mockExit = { ...gameMockData.content.areas.start.exits[0] };
    positionKeys.forEach((key, idx) => {
      const [x, y] = key.split('_');
      gameMock.content.areas.start.exits[idx] = { ...mockExit, x: +x, y: +y };
    });

    const { nextGame, newExit } = utilCreateExit({
      game: gameMock,
      selectedAreaId: 'start',
    });
    expect(nextGame).toBeFalsy();
    expect(newExit).toBeFalsy();
  });
});

describe('utilDeleteExit', () => {
  it('should delete an exit', () => {
    const gameMock = JSON.parse(JSON.stringify(gameMockData));
    const selectedAreaId = 'start';
    const exitId = '1735602762347';
    const { nextGame } = utilDeleteExit({
      game: gameMock,
      selectedAreaId,
      exitId,
    });
    expect(nextGame?.content.areas[selectedAreaId].exits.length).toEqual(0);
  });

  it('should return null when data is invalid ', () => {
    const gameMock = JSON.parse(JSON.stringify(gameMockData));
    gameMock.content.areas['start'].exits = null;
    const selectedAreaId = 'start';
    const exitId = '1735602762347';
    const { nextGame } = utilDeleteExit({
      game: gameMock,
      selectedAreaId,
      exitId,
    });
    expect(nextGame).toBeNull();
  });
});

describe('utilUpdateExit', () => {
  it('should update an exit', () => {
    const gameMock = JSON.parse(JSON.stringify(gameMockData));
    const selectedAreaId = 'start';
    const updatedExit = {
      id: '1735602762347',
      destinationAreaId: '1735602762347',
      exitType: 'default',
      direction: 'north',
      areaId: 'start',
      x: 1,
      y: 1,
      h: 1,
    };
    const { nextGame } = utilUpdateExit({
      game: gameMock,
      selectedAreaId,
      updatedExit,
    });
    expect(nextGame?.content.areas[selectedAreaId].exits[0].x).toEqual(1);
  });

  it('should return null when data is invalid ', () => {
    const gameMock = JSON.parse(JSON.stringify(gameMockData));
    const selectedAreaId = 'test';
    const updatedExit = {
      id: '1735602762347',
      destinationAreaId: '1735602762347',
      exitType: 'default',
      direction: 'north',
      areaId: 'start',
      x: 1,
      y: 1,
      h: 1,
    };
    const { nextGame } = utilUpdateExit({
      game: gameMock,
      selectedAreaId,
      updatedExit,
    });
    expect(nextGame).toBeNull();
  });
});
