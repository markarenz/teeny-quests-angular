import { Direction } from '@app/features/main/interfaces/enums';
import { QuestArea, QuestROM } from '@app/features/main/interfaces/types';
import { floorDefinitions } from '@content/floor-definitions';
import { getPositionKeysForGridSize } from '@main/utils';

export const findAnOpenCell = ({
  game,
  selectedAreaId,
  lockouts = [],
  allowZeroHeight = false,
  allowNonWalkable = false,
}: {
  game: QuestROM;
  selectedAreaId: string;
  lockouts?: string[];
  allowZeroHeight?: boolean;
  allowNonWalkable?: boolean;
}): string | null => {
  const area = game.content.areas[selectedAreaId];
  if (area) {
    const positionKeys = getPositionKeysForGridSize();
    const openCell = positionKeys.find(key => {
      const [y, x] = key.split('_');
      return (
        !lockouts.includes(key) &&
        !area.map[key].isHidden &&
        (allowZeroHeight || area.map[key].h > 0) &&
        (allowNonWalkable ||
          floorDefinitions[area.map[key].floor ?? 'default'].walkable) &&
        !area.exits.some(exit => exit.x === +x && exit.y === +y) &&
        !area.items.some(item => item.x === +x && item.y === +y)
      );
    });
    return openCell ?? null;
  }
  return null;
};

export const getDirectionFromString = (directionStr: string): Direction => {
  switch (directionStr.toLowerCase()) {
    case 'north':
      return Direction.NORTH;
    case 'south':
      return Direction.SOUTH;
    case 'east':
      return Direction.EAST;
    case 'west':
      return Direction.WEST;
    default:
      throw new Error(`Invalid direction string: ${directionStr}`);
  }
};
