import { GameROM } from '@app/features/main/interfaces/types';
import { floorDefinitions } from '@content/floor-definitions';
import { getPositionKeysForGridSize } from '@main/utils';

export const findAnOpenCell = ({
  game,
  selectedAreaId,
}: {
  game: GameROM;
  selectedAreaId: string;
}): string | null => {
  const area = game.content.areas[selectedAreaId];
  if (area) {
    const positionKeys = getPositionKeysForGridSize();
    const openCell = positionKeys.find((key) => {
      const [y, x] = key.split('_');
      return (
        floorDefinitions[area.map[key].floor ?? 'default'].walkable &&
        !area.exits.some((exit) => exit.x === +x && exit.y === +y) &&
        !area.items.some((item) => item.x === +x && item.y === +y)
      );
    });
    return openCell ?? null;
  }
  return null;
};
