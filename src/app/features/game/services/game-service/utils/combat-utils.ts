import {
  Inventory,
  QuestActor,
  QuestState,
  SelectIUIOption,
} from '@app/features/main/interfaces/types';
import { itemWeaponDefinitions } from '@content/item-definitions';
import { getIsNearPosition } from './common';
import { Direction } from '@app/features/main/interfaces/enums';

/**
 * Determines if the player is positioned adjacent to any actor in their current area.
 * @param nextGameState - The current quest game state containing player position and actors data
 * @returns true if the player is near at least one actor, false otherwise
 */
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

/**
 * Retrieves the available weapon options for the player based on their inventory.
 * @param inventory - The player's inventory containing items and weapons
 * @returns An array of selectable weapon options for the player
 */
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

/**
 * Updates the game state with the modified actor data.
 *
 * @param gameState - The current quest state to be updated
 * @param actor - The actor with updated properties
 * @returns A new QuestState object with the actor updated in its corresponding area
 *
 * @example
 * const updatedState = updateActorGameState(gameState, modifiedActor);
 */
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

/**
 * Determines the direction from one position to another.
 * @param y1 - The y-coordinate of the starting position
 * @param x1 - The x-coordinate of the starting position
 * @param y2 - The y-coordinate of the target position
 * @param x2 - The x-coordinate of the target position
 * @returns The direction faced when looking from position (y1, x1) toward position (y2, x2)
 */
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

/**
 * Returns the opposite direction of the given direction.
 * @param direction - The input direction
 * @returns The opposite direction (NORTH ↔ SOUTH, EAST ↔ WEST)
 */
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

/**
 * Removes an actor from the game state by filtering it out of its associated area.
 *
 * @param gameState - The current quest game state
 * @param actor - The actor to be deleted from the game state
 * @returns A new game state object with the specified actor removed from its area's actors list
 */
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

/**
 * Determines the best weapon available to the player based on maximum damage.
 *
 * @param inventory - The player's inventory object containing available items, or undefined
 * @returns The ID of the weapon with the highest max damage, or 'bareHands' if no inventory exists
 *
 * @remarks
 * - If no inventory is provided, returns the default 'bareHands' weapon ID
 * - Filters available weapons from the inventory against defined weapon items
 * - Always includes 'bareHands' as a fallback option
 * - Selects the weapon with the highest maxDamage value
 */
export const getBestPlayerWeapon = (
  inventory: Inventory | undefined
): string => {
  const defaultWeaponId = 'bareHands';
  if (!inventory) {
    return defaultWeaponId;
  }
  const inventoryKeys = Object.keys(inventory);
  const weaponDefs = Object.values(itemWeaponDefinitions).filter(
    def => inventoryKeys.includes(def.id) || def.id === defaultWeaponId
  );
  const bestWeapon = weaponDefs.reduce((best, current) =>
    current.maxDamage > best.maxDamage ? current : best
  );
  return bestWeapon.id;
};
