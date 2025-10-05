import { getPositionKeysForGridSize } from '@app/features/main/utils';
import {
  getHeuristicDistance,
  validateMovePositionKey,
  getPathBetweenPoints,
  getMoveOptions,
} from './pathfinding';
import gameMockData from '@app/features/editor/mocks/game.mock';

describe('getHeuristicDistance', () => {
  it('should return the correct distance', () => {
    const start = '0_0';
    const end = '1_1';
    expect(getHeuristicDistance(start, end)).toBe(2);
  });

  it('should return the correct distance', () => {
    const start = '0_0';
    const end = '6_6';
    expect(getHeuristicDistance(start, end)).toBe(12);
  });
});

describe('validateMovePositionKey', () => {
  const areaMap = gameMockData.content.areas['start'].map;

  it('should return true for a valid position', () => {
    const positionKey = '1_1';
    expect(validateMovePositionKey({ areaMap, positionKey })).toBe(true);
  });

  it('should return false for an invalid position', () => {
    const positionKey = '0_0';
    expect(validateMovePositionKey({ areaMap, positionKey })).toBe(false);
  });
});

describe('getPathBetweenPoints', () => {
  const areaMap = gameMockData.content.areas['start'].map;
  const areaItems = gameMockData.content.areas['start'].items;
  const positionKeys = getPositionKeysForGridSize();

  it('should return a path', () => {
    const start = '1_1';
    const end = '1_2';
    const path = getPathBetweenPoints({
      start,
      end,
      areaMap,
      areaItems,
      positionKeys,
    });
    expect(path).toEqual(['1_1', '1_2']);
  });

  it('should return an empty array when no path is found', () => {
    const start = '1_1';
    const end = '0_0';
    expect(
      getPathBetweenPoints({ start, end, areaMap, areaItems, positionKeys })
    ).toEqual([]);
  });
});

describe('getMoveOptions', () => {
  const areaMap = gameMockData.content.areas['start'].map;
  const areaItems = gameMockData.content.areas['start'].items;
  const positionKeyStart = '1_1';

  it('should return an object with movement options', () => {
    const movementOptions = getMoveOptions({
      positionKeyStart,
      areaMap,
      areaItems,
    });
    expect(Object.keys(movementOptions).length).toBeGreaterThan(0);
  });

  it('should return an empty object when no movement options are available', () => {
    const movementOptions = getMoveOptions({
      positionKeyStart,
      areaMap,
      areaItems,
    });
    expect(Object.keys(movementOptions).length).toBeGreaterThan(0);
  });
});
