import { Direction, EventAction } from '@app/features/main/interfaces/enums';
import { inventoryDefinitions } from '@content/item-definitions';
import {
  QuestAreaMap,
  QuestAreaMapCell,
  QuestItem,
  QuestROM,
  QuestState,
} from '@app/features/main/interfaces/types';
import { ExitType } from '@content/exit-definitions';

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

export const calcScore = (
  gameState: QuestState,
  questROM: QuestROM
): number => {
  let score = 0;
  Object.keys(gameState.player.inventory ?? {}).forEach(inventoryKey => {
    const itemCount = gameState.player.inventory[inventoryKey];
    const itemDef = inventoryDefinitions[inventoryKey];
    if (itemDef && itemDef.scoreValue) {
      score += itemDef.scoreValue * itemCount;
    }
  });
  if (gameState.flagValues['gameEnded']) {
    score += 1000; // Bonus for completing the game
  }
  questROM.content.flags?.forEach(flagDef => {
    if (flagDef.scoreValue && gameState.flagValues[flagDef.id]) {
      score += flagDef.scoreValue;
    }
  });
  score -= gameState.numTurns;
  return Math.max(0, score);
};

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
