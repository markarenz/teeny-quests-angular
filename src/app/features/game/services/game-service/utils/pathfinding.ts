import {
  GameAreaMap,
  GameItem,
  MovementOptions,
  PathfindingGridCell,
} from '@main/interfaces/types';
import { floorDefinitions } from '@content/floor-definitions';
import { getPositionKeysForGridSize } from '@main/utils';

export const getHeuristicDistance = (p1: string, p2: string) => {
  const [x1, y1] = p1.split('_');
  const [x2, y2] = p2.split('_');

  let d1 = Math.abs(+x2 - +x1);
  let d2 = Math.abs(+y2 - +y1);

  return d1 + d2;
};

export const validateMovePositionKey = ({
  areaMap,
  positionKey,
}: {
  areaMap: GameAreaMap;
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
  if (areaMap[positionKey].isHidden) {
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

export const getPathBetweenPoints = ({
  start,
  end,
  areaMap,
  areaItems,
  positionKeys,
}: {
  start: string;
  end: string;
  areaMap: GameAreaMap;
  areaItems: GameItem[];
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

export const getMoveOptions = ({
  positionKeyStart,
  areaMap,
  areaItems,
}: {
  positionKeyStart: string;
  areaMap: GameAreaMap;
  areaItems: GameItem[];
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
      // Forbit player from moving to an invalid position
      validateMovePositionKey({
        areaMap,
        positionKey,
      }) &&
      // Forbit player from moving to a cell with an item
      !areaItems.some(item => {
        `${item.y}_${item.x}` === positionKey;
      }) &&
      // Ignore start position
      positionKey !== positionKeyStart
    ) {
      const path = getPathBetweenPoints({
        start: positionKeyStart,
        end: positionKey,
        areaMap,
        areaItems,
        positionKeys,
      });
      if (path.length > 0) {
        movementOptions[positionKey] = path;
      }
    }
  }

  return movementOptions;
};
