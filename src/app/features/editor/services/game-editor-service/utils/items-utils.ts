import { Game, GameItem } from '@app/features/main/interfaces/types';
import { findAnOpenCell } from './common-utils';
import { defaultGridSize } from '@config/index';
import { v4 as uuidv4 } from 'uuid';

export const utilDeleteItem = ({
  game,
  selectedAreaId,
  itemId,
}: {
  game: Game;
  selectedAreaId: string;
  itemId: string;
}) => {
  const nextGame = { ...game } as Game;
  const items = game.content.areas[selectedAreaId].items;
  if (items) {
    const newItems = items.filter((item) => item.id !== itemId);
    nextGame.content.areas[selectedAreaId] = {
      ...nextGame?.content.areas[selectedAreaId],
      items: newItems,
    };
  }

  return nextGame;
};

export const utilCreateItem = ({
  game,
  selectedAreaId,
}: {
  game: Game;
  selectedAreaId: string;
}): { nextGame: Game | null; newItem: GameItem | null } => {
  const areas = game.content.areas;
  if (areas) {
    const area = areas[selectedAreaId] ?? {
      items: [],
    };
    const openCellPosition = findAnOpenCell({ game, selectedAreaId });
    if (openCellPosition) {
      const [y, x] = openCellPosition.split('_');
      let direction = 'north';
      if (+y < 2) {
        direction = 'north';
      } else if (+y > defaultGridSize - 3) {
        direction = 'south';
      } else if (+x < 2) {
        direction = 'east';
      } else if (+x > defaultGridSize - 3) {
        direction = 'west';
      }

      let h = area ? area.map[openCellPosition].h : 1;
      const newItem: GameItem = {
        id: uuidv4(),
        itemType: 'coins-25',
        areaId: selectedAreaId,
        x: +x,
        y: +y,
        h,
      };

      const nextGame = { ...game } as Game;
      nextGame.content.areas[selectedAreaId] = {
        ...nextGame?.content.areas[selectedAreaId],
        items: [
          ...(nextGame?.content.areas[selectedAreaId].items ?? []),
          newItem,
        ],
      };
      return { nextGame, newItem };
    }
  }
  return {
    nextGame: null,
    newItem: null,
  };
};

export const utilUpdateItem = ({
  game,
  updatedItem,
  selectedAreaId,
}: {
  game: Game;
  updatedItem: GameItem;
  selectedAreaId: string;
}): Game => {
  const id = updatedItem.id;
  const gameObj = { ...game } as Game;
  const area = gameObj?.content.areas[selectedAreaId];

  if (area) {
    const newItems = area.items.map((item) =>
      item.id === id
        ? {
            ...updatedItem,
            h: area.map[`${updatedItem.y}_${updatedItem.x}`].h,
          }
        : item
    );
    gameObj.content.areas[selectedAreaId] = {
      ...gameObj?.content.areas[selectedAreaId],
      items: newItems,
    };
  }

  return gameObj;
};
