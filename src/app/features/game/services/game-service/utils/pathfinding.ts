import {
  QuestAreaMap,
  QuestItem,
  MovementOptions,
  PathfindingGridCell,
  QuestActor,
} from '@main/interfaces/types';
import { floorDefinitions } from '@content/floor-definitions';
import { getPositionKeysForGridSize } from '@main/utils';

/**
 * Calculates the Manhattan distance between two points represented as strings.
 * @param p1 - The first point in the format "x_y"
 * @param p2 - The second point in the format "x_y"
 * @returns The Manhattan distance (sum of absolute differences in x and y coordinates)
 */
export const getHeuristicDistance = (p1: string, p2: string) => {
  const [x1, y1] = p1.split('_');
  const [x2, y2] = p2.split('_');

  let d1 = Math.abs(+x2 - +x1);
  let d2 = Math.abs(+y2 - +y1);

  return d1 + d2;
};

/**
 * Validates whether a position in the area map is valid for movement.
 *
 * A position is considered valid if:
 * - The cell exists in the area map
 * - The cell's floor type is walkable
 * - The cell is not hidden
 *
 * @param areaMap - The quest area map containing cell data
 * @param positionKey - A string key in the format "y_x" representing the position
 * @returns `true` if the position is valid for movement, `false` otherwise
 */
export const validateMovePositionKey = ({
  areaMap,
  positionKey,
}: {
  areaMap: QuestAreaMap;
  positionKey: string;
}): boolean => {
  const [y, x] = positionKey.split('_');

  // Does the cell not exist?
  if (!areaMap[positionKey]) {
    return false;
  }

  // is the cell not walkable?
  if (!floorDefinitions[areaMap[positionKey].floor].walkable) {
    return false;
  }

  // is the cell hidden?
  if (areaMap[positionKey].isHidden || areaMap[positionKey].h === 0) {
    return false;
  }

  return true;
};

/*
 * Based on A* pathfinding post by Simon Pfeiffer
 *   https://dev.to/codesphere/pathfinding-with-javascript-the-a-algorithm-3jlb
 * For more info on heuristics and Manhattan distance, go here to learn more:
 *   https://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
 */

/**
 * Finds the shortest path between two points on a quest area map using the A* pathfinding algorithm.
 *
 * @param start - The starting position key in the format "y_x"
 * @param end - The ending position key in the format "y_x"
 * @param areaMap - The quest area map containing height and terrain information
 * @param areaActors - Array of actors currently on the map to avoid during pathfinding
 * @param positionKeys - Array of all valid position keys in the area
 *
 * @returns An array of position keys representing the path from start to end, or an empty array if no path exists
 *
 */
export const getPathBetweenPoints = ({
  start,
  end,
  areaMap,
  areaActors,
  positionKeys,
}: {
  start: string;
  end: string;
  areaMap: QuestAreaMap;
  areaActors: QuestActor[];
  positionKeys: string[];
}): string[] => {
  // Initialize open and closed sets
  let path: PathfindingGridCell[] = [];
  const startCell: PathfindingGridCell = {
    positionKey: start,
    f: 0,
    g: 0,
    h: 0,
    parent: null,
  };
  const endCell: PathfindingGridCell = {
    positionKey: end,
    f: 0,
    g: 0,
    h: 0,
    parent: null,
  };
  const closedSet: PathfindingGridCell[] = [];
  const openSet: PathfindingGridCell[] = [startCell];
  // Initialize pathfinding grid
  const pathfindingGrid: PathfindingGridCell[] = [];
  for (let i = 0; i < positionKeys.length; i++) {
    pathfindingGrid[i] = {
      positionKey: positionKeys[i],
      f: 0,
      g: 0,
      h: 0,
      parent: null,
    };
  }

  // Main Search Loop
  while (openSet.length > 0) {
    let lowestIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }

    const currentCell = openSet[lowestIndex];

    // Check completion condition
    if (currentCell.positionKey === endCell.positionKey) {
      let temp = currentCell;
      path.push(temp);
      while (temp.parent) {
        path.push(temp.parent);
        temp = temp.parent;
      }
      return path.reverse().map(cell => cell.positionKey);
    }

    // Remove the current cell from the openSet
    openSet.splice(lowestIndex, 1);
    // add current to closedSet
    closedSet.push(currentCell);

    // Process neighboring cells
    const [y, x] = currentCell.positionKey.split('_');
    const neighboingPositionKeys = [
      `${+y - 1}_${x}`,
      `${+y + 1}_${x}`,
      `${y}_${+x + 1}`,
      `${y}_${+x - 1}`,
    ];
    for (let i = 0; i < neighboingPositionKeys.length; i++) {
      const neighboringKey = neighboingPositionKeys[i];
      let neighbor = pathfindingGrid.find(
        cell => cell.positionKey === neighboringKey
      );

      const deltaHeight =
        neighbor && currentCell
          ? Math.abs(
              areaMap[currentCell.positionKey].h -
                areaMap[neighbor.positionKey].h
            )
          : 0;
      const isValidCell =
        neighbor &&
        deltaHeight < 2 &&
        !areaActors.some(
          actor => actor.y + '_' + actor.x === neighbor.positionKey
        ) &&
        validateMovePositionKey({
          areaMap,
          positionKey: neighbor.positionKey,
        });

      if (!neighbor || !isValidCell) {
        continue;
      }

      if (!closedSet.includes(neighbor)) {
        const possibleG = currentCell.g + 1;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        } else if (possibleG >= neighbor.g) {
          // Inneficient path
          continue;
        }

        neighbor.g = possibleG;
        neighbor.h = getHeuristicDistance(
          neighbor.positionKey,
          endCell.positionKey
        );
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = currentCell;
      }
    }
  }

  return [];
};

/**
 * Calculates valid movement options from a starting position on the game area map.
 *
 * @param positionKeyStart - The starting position key in format "y_x"
 * @param areaMap - The quest area map defining valid and invalid tiles
 * @param areaItems - Array of items present in the area
 * @param areaActors - Array of actors/NPCs currently in the area
 * @returns An object mapping valid destination position keys to their paths from the start position
 * @remarks
 * - Returns empty object if the start position is invalid
 * - Excludes positions occupied by actors
 * - Excludes the start position itself
 * - Only includes positions reachable via a valid path
 * @example
 * const options = getMoveOptions({
 *   positionKeyStart: "5_3",
 *   areaMap,
 *   areaItems: [],
 *   areaActors: []
 * });
 */
export const getMoveOptions = ({
  positionKeyStart,
  areaMap,
  areaItems,
  areaActors,
}: {
  positionKeyStart: string;
  areaMap: QuestAreaMap;
  areaItems: QuestItem[];
  areaActors: QuestActor[];
}): MovementOptions => {
  const movementOptions: MovementOptions = {};
  if (
    !validateMovePositionKey({
      areaMap,
      positionKey: positionKeyStart,
    })
  ) {
    return {};
  }

  const positionKeys = getPositionKeysForGridSize();
  for (const positionKey of positionKeys) {
    if (
      // Forbid player from moving to an invalid position
      validateMovePositionKey({
        areaMap,
        positionKey,
      }) &&
      // Forbid player from moving to a cell with an actor
      !areaActors.some(actor => {
        return `${actor.y}_${actor.x}` === positionKey;
      }) &&
      // Ignore start position
      positionKey !== positionKeyStart
    ) {
      const path = getPathBetweenPoints({
        start: positionKeyStart,
        end: positionKey,
        areaMap,
        areaActors,
        positionKeys,
      });
      if (path.length > 0) {
        movementOptions[positionKey] = path;
      }
    }
  }

  return movementOptions;
};
