import { utilCreateItem, utilUpdateItem, utilDeleteItem } from './items-utils';
import { getPositionKeysForGridSize } from '@main/utils';
import gameMockData from '@app/features/editor/mocks/game.mock.json';
import { GameItem } from '@app/features/main/interfaces/types';

describe('utilDeleteItem', () => {
  it('should delete an item', () => {
    const gameMock = JSON.parse(JSON.stringify(gameMockData));
    gameMock.content.areas['start'].items = [
      {
        id: 'item-1',
        itemType: 'key',
        areaId: 'start',
        x: 3,
        y: 5,
        h: 1,
      },
    ];
    const selectedAreaId = 'start';
    const itemId = 'item-1';
    const nextGame = utilDeleteItem({
      game: gameMock,
      selectedAreaId,
      itemId,
    });
    expect(nextGame.content.areas[selectedAreaId].items.length).toEqual(0);
  });
});

describe('utilCreateItem', () => {
  it('creates a new default item in an open spot- facing north', () => {
    const gameMock = JSON.parse(JSON.stringify(gameMockData));
    const { nextGame, newItem } = utilCreateItem({
      game: gameMock,
      selectedAreaId: 'start',
      lockouts: [],
    });
    expect(nextGame?.content.areas['start'].items.length).toBeGreaterThan(1);
    expect(newItem?.id).toBeTruthy();
  });
  it('creates a new default item in an open spot- facing south', () => {
    const gameMock = JSON.parse(JSON.stringify(gameMockData));
    const positionKeys = getPositionKeysForGridSize();
    const mockItem = { ...gameMockData.content.areas.start.items[0] };
    positionKeys.forEach((key, idx) => {
      const [x, y] = key.split('_');
      gameMock.content.areas.start.items[idx] = { ...mockItem, x: +x, y: +y };
    });

    const { nextGame, newItem } = utilCreateItem({
      game: gameMock,
      selectedAreaId: 'start',
      lockouts: [],
    });
    expect(newItem?.id).toBeFalsy();
  });
});

describe('utilUpdateItem', () => {
  it('should update an item', () => {
    const gameMock = JSON.parse(JSON.stringify(gameMockData));
    const selectedAreaId = 'start';
    const itemId = '1234abc';
    const mockUpdatedItem: GameItem = {
      id: itemId,
      itemType: 'key',
      areaId: 'start',
      x: 5,
      y: 5,
      h: 1,
    };
    const nextGame = utilUpdateItem({
      game: gameMock,
      selectedAreaId,
      updatedItem: mockUpdatedItem,
    });

    expect(nextGame.content.areas[selectedAreaId].items[0]).toEqual(
      mockUpdatedItem
    );
  });
});
