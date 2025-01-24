import { Game } from '@app/features/main/interfaces/types';
import { defaultGridSize } from '@config/index';
import { floorDefinitions } from '@content/floor-definitions';

export const getPositionKeysForGridSize = (): string[] => {
  const numCells = defaultGridSize * defaultGridSize;
  return Array.from({ length: numCells }, (_, i) => {
    const x = i % defaultGridSize;
    const y = Math.floor(i / defaultGridSize);
    return `${y}_${x}`;
  });
};

export const findAnOpenCell = ({
  game,
  selectedAreaId,
}: {
  game: Game;
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
