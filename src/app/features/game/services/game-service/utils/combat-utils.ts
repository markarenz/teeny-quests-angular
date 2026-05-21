import {
  Inventory,
  QuestActor,
  QuestState,
  SelectIUIOption,
} from '@app/features/main/interfaces/types';
import { itemWeaponDefinitions } from '@content/item-definitions';
import { getIsNearPosition } from './common';
import { Direction } from '@app/features/main/interfaces/enums';

export const getIsPlayerNearActorCell = (
  nextGameState: QuestState
): boolean => {
  return nextGameState.areas[nextGameState.player.areaId].actors?.some(
    (a: QuestActor) =>
      getIsNearPosition(
        a.y,
        a.x,
        false,
        `${nextGameState.player.y}_${nextGameState.player.x}`,
        nextGameState.areas[nextGameState.player.areaId].map
      )
  );
};

export const getWeaponOptions = (
  inventory: Inventory | undefined
): SelectIUIOption[] => {
  if (!inventory) {
    return [];
  }
  const inventoryKeys = Object.keys(inventory);
  const itemWeaponOptions: SelectIUIOption[] = Object.values(
    itemWeaponDefinitions
  )
    .filter(def => inventoryKeys.includes(def.id) || def.id === 'bareHands')
    .map(def => ({
      value: def.id,
      label: def.name,
    }));
  return itemWeaponOptions;
};

export const updateActorGameState = (
  gameState: QuestState,
  actor: QuestActor
): QuestState => {
  const nextGameState: QuestState = {
    ...gameState,
    areas: {
      ...gameState.areas,
      [actor.areaId]: {
        ...gameState.areas[actor.areaId],
        actors: gameState.areas[actor.areaId].actors?.map(a =>
          a.id === actor.id ? actor : a
        ),
      },
    },
  };
  return nextGameState;
};

export const getFacingForPosition = (
  y1: number,
  x1: number,
  y2: number,
  x2: number
): Direction => {
  if (x1 < x2) {
    return Direction.EAST;
  } else if (x1 > x2) {
    return Direction.WEST;
  } else if (y1 < y2) {
    return Direction.SOUTH;
  } else if (y1 > y2) {
    return Direction.NORTH;
  }
  return Direction.NORTH;
};

export const getOppositeDirection = (direction: Direction): Direction => {
  switch (direction) {
    case Direction.NORTH:
      return Direction.SOUTH;
    case Direction.SOUTH:
      return Direction.NORTH;
    case Direction.EAST:
      return Direction.WEST;
    case Direction.WEST:
      return Direction.EAST;
  }
};

export const deleteActorGameState = (
  gameState: QuestState,
  actor: QuestActor
) => {
  const nextGameState: QuestState = {
    ...gameState,
    areas: {
      ...gameState.areas,
      [actor.areaId]: {
        ...gameState.areas[actor.areaId],
        actors: gameState.areas[actor.areaId].actors?.filter(
          a => a.id !== actor.id
        ),
      },
    },
  };
  return nextGameState;
};
