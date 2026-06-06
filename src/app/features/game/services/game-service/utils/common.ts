import { Direction, EventAction } from '@app/features/main/interfaces/enums';
import { inventoryDefinitions } from '@content/item-definitions';
import {
  Inventory,
  QuestAreaMap,
  QuestAreaMapCell,
  QuestItem,
  QuestROM,
  QuestState,
} from '@app/features/main/interfaces/types';
import { ExitType } from '@content/exit-definitions';

/**
 * Generates a string describing the level goals for a quest.
 *
 * Examines the quest ROM to identify all objectives the player must complete:
 * - Events that trigger a 'gameEnded' flag are considered goals
 * - Areas containing exit doors marked as GAME_END are considered goals
 *
 * @param questROM - The quest ROM object containing events and areas data
 * @returns A capitalized string of all goals joined by ' -or- ' and ending with a period.
 *          Example: "Defeat the boss -or- explore and find the exit."
 */
export const getLevelGoals = (questROM: QuestROM): string => {
  const levelGoalsArr: string[] = [];

  questROM.content.events?.forEach(event => {
    const hasGameEndAction = event.actions.some(
      action =>
        action.action === EventAction.SET_FLAG &&
        action.actionObject.identifier === 'gameEnded'
    );
    if (hasGameEndAction) {
      levelGoalsArr.push(event.name);
    }
  });

  /**
   * Checks if the quest ROM contains at least one area with a game-ending exit door.
   * Iterates through all areas in the quest ROM content and determines if any area
   * has an exit with the type GAME_END.
   * @returns {boolean} True if a game-ending exit door exists, false otherwise.
   */
  const hasExitDoor = Object.keys(questROM.content.areas ?? {}).some(
    areaKey => {
      const area = questROM.content.areas[areaKey];
      return area.exits.some(exit => exit.exitType === ExitType.GAME_END);
    }
  );
  if (hasExitDoor) {
    levelGoalsArr.push('explore and find the exit');
  }
  // Capitalize first letter
  const levelGoalsText = levelGoalsArr.join(' -or- ') + '.';
  return levelGoalsText[0].toUpperCase() + levelGoalsText.slice(1);
};

/**
 * Calculates the final score for a quest game state.
 *
 * The score is determined by:
 * - Items in the player's inventory multiplied by their individual score values
 * - A 1000 point bonus if the game has been completed
 * - Flag values that have associated score bonuses
 * - A deduction of 1 point per turn taken
 *
 * @param gameState - The current quest game state containing player inventory, flags, and turn count
 * @param questROM - The quest ROM definition containing flag definitions with score values
 * @returns The calculated score, with a minimum value of 0
 */
export const calcScore = (
  gameState: QuestState,
  questROM: QuestROM
): number => {
  let score = 0;
  let initialInventoryScore = getScoreForInventory(
    questROM.content.player.inventory ?? {}
  );
  const inventoryScore = getScoreForInventory(gameState.player.inventory);
  if (gameState.flagValues['gameEnded']) {
    const healthBonus = gameState.player.health * 200;
    score += 1000 + healthBonus; // Bonus for completing the game
  }
  questROM.content.flags?.forEach(flagDef => {
    if (flagDef.scoreValue && gameState.flagValues[flagDef.id]) {
      score += flagDef.scoreValue;
    }
  });
  // If the player starts with X gold or inventory, subtract that from the initial score
  score += inventoryScore - initialInventoryScore;
  score -= gameState.numTurns;
  return Math.max(0, score);
};

/**
 * Calculates the total score value from a player's inventory.
 *
 * Iterates through all items in the inventory and multiplies each item's count
 * by its individual score value from the item definitions.
 *
 * @param inventory - The player's inventory object mapping item keys to their quantities
 * @returns The total score value from all items in the inventory
 */
const getScoreForInventory = (inventory: Inventory): number => {
  let score = 0;
  Object.keys(inventory ?? {}).forEach(inventoryKey => {
    const itemCount = inventory[inventoryKey];
    const itemDef = inventoryDefinitions[inventoryKey];
    if (itemDef && itemDef.scoreValue) {
      score += itemDef.scoreValue * itemCount;
    }
  });
  return score;
};

/**
 * Determines if a position is near a target position.
 *
 * @param y - The y-coordinate of the current position
 * @param x - The x-coordinate of the current position
 * @param exact - If true, checks for exact position match; if false, checks for adjacency
 * @param targetPosition - The target position in "y_x" format
 * @param areaMap - Optional map containing height information for positions
 * @returns True if the position is exact or adjacent (within 1 height unit) to the target position, false otherwise
 */
export const getIsNearPosition = (
  y: number,
  x: number,
  exact: boolean,
  targetPosition: string,
  areaMap?: QuestAreaMap
): boolean => {
  if (exact) {
    return targetPosition === `${y}_${x}`;
  }
  const [targetY, targetX] = targetPosition.split('_').map(Number);

  const h = areaMap?.[`${y}_${x}`]?.h ?? 0;
  const ht = areaMap?.[`${targetY}_${targetX}`]?.h ?? 0;

  const dh = Math.abs(h - ht);
  return (
    ((y === targetY && (x === targetX - 1 || x === targetX + 1)) ||
      (x === targetX && (y === targetY - 1 || y === targetY + 1))) &&
    dh <= 1
  );
};

/**
 * Clamps a value after applying a delta, ensuring it doesn't go below zero.
 *
 * @param val - The initial value.
 * @param delta - The change to apply to the value.
 * @returns The clamped value, rounded to two decimal places.
 */
export const changeValueClamped = (val: number, delta: number): number => {
  return Math.max(Math.floor((val + delta) * 100) / 100, 0);
};

/**
 * Converts a cardinal direction to its opposite direction.
 *
 * @param direction The source direction.
 * @returns The opposite cardinal direction, or the original value if it is
 * not recognized.
 */
export const getOppositeDirection = (direction: Direction): Direction => {
  const mapper: { [key in Direction]: Direction } = {
    [Direction.NORTH]: Direction.SOUTH,
    [Direction.SOUTH]: Direction.NORTH,
    [Direction.EAST]: Direction.WEST,
    [Direction.WEST]: Direction.EAST,
  };
  return mapper[direction] ?? direction;
};

/**
 * Updates the game state with a new item dropped at the player's current position.
 *
 * @param nextGameState The current game state.
 * @param dropItem The item to be dropped.
 * @returns The updated game state with the new item added.
 */

export const dropNewItem = (
  nextGameState: QuestState,
  dropItem: string,
  y: number,
  x: number
): QuestState => {
  const droppedItem: QuestItem = {
    id: `${dropItem}_${Date.now()}`,
    itemType: dropItem,
    x: x,
    y: y,
    h: nextGameState.areas[nextGameState.player.areaId].map[`${y}_${x}`].h,
    areaId: nextGameState.player.areaId,
  };

  return {
    ...nextGameState,
    areas: {
      ...nextGameState.areas,
      [nextGameState.player.areaId]: {
        ...nextGameState.areas[nextGameState.player.areaId],
        items: [
          ...(nextGameState.areas[nextGameState.player.areaId].items ?? []),
          droppedItem,
        ],
      },
    },
  };
};
