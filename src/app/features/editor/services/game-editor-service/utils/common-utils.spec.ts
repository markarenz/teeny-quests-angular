import { findAnOpenCell, getDirectionFromString } from './common-utils';
import questMockData from '@app/features/editor/mocks/game.mock';
import { Direction } from '@app/features/main/interfaces/enums';
import { getPositionKeysForGridSize } from '@main/utils';

describe('findAnOpenCell', () => {
  it('return an open map cell position', () => {
    const result = findAnOpenCell({
      game: { ...questMockData },
      selectedAreaId: 'start',
    });
    expect(result).toBe('1_1');
  });
  it('return an open map cell position: more items', async () => {
    const gameMock = await JSON.parse(JSON.stringify(questMockData));
    gameMock.content.areas['start'].items[0].x = 1;
    gameMock.content.areas['start'].items[0].y = 1;
    const result = findAnOpenCell({
      game: gameMock,
      selectedAreaId: 'start',
    });
    expect(result).toBe('1_2');
  });

  it('return null when no open map cell exists', () => {
    const gameMock = JSON.parse(JSON.stringify(questMockData));
    const mockItem = { ...questMockData.content.areas['start'].items[0] };
    const positionKeys = getPositionKeysForGridSize();
    positionKeys.forEach((key, idx) => {
      const [y, x] = key.split('_');
      gameMock.content.areas['start'].items[idx] = {
        ...mockItem,
        x: +x,
        y: +y,
      };
    });
    const result = findAnOpenCell({
      game: gameMock,
      selectedAreaId: 'start',
    });
    expect(result).toBe(null);
  });
});

describe('getDirectionFromString', () => {
  it('returns correct direction for valid input', () => {
    expect(getDirectionFromString('NORTH')).toBe(Direction.NORTH);
    expect(getDirectionFromString('EAST')).toBe(Direction.EAST);
    expect(getDirectionFromString('SOUTH')).toBe(Direction.SOUTH);
    expect(getDirectionFromString('WEST')).toBe(Direction.WEST);
  });

  it('returns default for invalid input', () => {
    expect(getDirectionFromString('UP')).toBe(Direction.NORTH);
    expect(getDirectionFromString('DOWN')).toBe(Direction.NORTH);
    expect(getDirectionFromString('LEFT')).toBe(Direction.NORTH);
    expect(getDirectionFromString('RIGHT')).toBe(Direction.NORTH);
    expect(getDirectionFromString('')).toBe(Direction.NORTH);
    expect(getDirectionFromString('NORTHEAST')).toBe(Direction.NORTH);
  });
});
