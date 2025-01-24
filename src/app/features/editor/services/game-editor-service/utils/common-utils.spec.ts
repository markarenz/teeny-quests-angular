import { findAnOpenCell, getPositionKeysForGridSize } from './common-utils';
import gameMockData from '@app/features/editor/mocks/game.mock.json';

describe('getPositionKeysForGridSize', () => {
  it('returns position keys based on grid size', () => {
    const keys = getPositionKeysForGridSize();
    expect(keys.length).toEqual(49);
  });
});

describe('findAnOpenCell', () => {
  it('return an open map cell position', () => {
    const result = findAnOpenCell({
      game: { ...gameMockData },
      selectedAreaId: 'start',
    });
    expect(result).toBe('1_1');
  });
  it('return an open map cell position: more items', async () => {
    const gameMock = await JSON.parse(JSON.stringify(gameMockData));
    gameMock.content.areas.start.items[0].x = 1;
    gameMock.content.areas.start.items[0].y = 1;
    const result = findAnOpenCell({
      game: gameMock,
      selectedAreaId: 'start',
    });
    expect(result).toBe('1_2');
  });

  it('return null when no open map cell exists', () => {
    const gameMock = JSON.parse(JSON.stringify(gameMockData));
    const mockItem = { ...gameMockData.content.areas.start.items[0] };
    const positionKeys = getPositionKeysForGridSize();
    positionKeys.forEach((key, idx) => {
      const [x, y] = key.split('_');
      gameMock.content.areas.start.items[idx] = { ...mockItem, x: +x, y: +y };
    });
    const result = findAnOpenCell({
      game: gameMock,
      selectedAreaId: 'start',
    });
    expect(result).toBe(null);
  });
});
