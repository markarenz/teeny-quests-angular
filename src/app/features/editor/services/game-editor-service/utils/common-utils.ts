import { GameArea, GameROM } from '@app/features/main/interfaces/types';
import { floorDefinitions } from '@content/floor-definitions';
import { getPositionKeysForGridSize } from '@main/utils';

export const findAnOpenCell = ({
  game,
  selectedAreaId,
  lockouts = [],
}: {
  game: GameROM;
  selectedAreaId: string;
  lockouts?: string[];
}): string | null => {
  const area = game.content.areas[selectedAreaId];
  if (area) {
    const positionKeys = getPositionKeysForGridSize();
    const openCell = positionKeys.find(key => {
      const [y, x] = key.split('_');
      return (
        !lockouts.includes(key) &&
        !area.map[key].isHidden &&
        area.map[key].h > 0 &&
        floorDefinitions[area.map[key].floor ?? 'default'].walkable &&
        !area.exits.some(exit => exit.x === +x && exit.y === +y) &&
        !area.items.some(item => item.x === +x && item.y === +y)
      );
    });
    return openCell ?? null;
  }
  return null;
};
