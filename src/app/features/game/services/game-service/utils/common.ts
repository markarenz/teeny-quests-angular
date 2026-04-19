import {
  ConditionValueType,
  EventAction,
  EventConditionType,
} from '@app/features/main/interfaces/enums';
import { inventoryDefinitions } from '@content/item-definitions';
import { QuestROM, QuestState } from '@app/features/main/interfaces/types';
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
