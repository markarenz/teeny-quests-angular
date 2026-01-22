import {
  ConditionValueType,
  EventAction,
  EventConditionType,
} from '@app/features/main/interfaces/enums';
import { inventoryDefinitions } from '@content/item-definitions';
import { GameROM } from '@app/features/main/interfaces/types';
import { ExitType } from '@content/exit-definitions';

export const getLevelGoals = (gameROM: GameROM): string => {
  const levelGoalsArr: string[] = [];

  // Find events that set the 'gameCompleted' flag
  gameROM.content.events.forEach(event => {
    const gameEndEvents = event.actions.filter(
      action =>
        action.action === EventAction.SET_FLAG &&
        action.actionObject.identifier === 'gameCompleted'
    );
    event.conditions.forEach(condition => {
      if (condition.conditionType === EventConditionType.INVENTORY) {
        const inventoryDefinition = inventoryDefinitions[condition.identifier];
        levelGoalsArr.push(
          parseFloat(`${condition.value}`) > 1
            ? `collect ${condition.value} ${inventoryDefinition.pluralName}`
            : `find ${inventoryDefinition.article} ${inventoryDefinition.name}`
        );
      }
    });
  });

  // Look for level exits
  const hasExitDoor = Object.keys(gameROM.content.areas).some(areaKey => {
    const area = gameROM.content.areas[areaKey];
    return area.exits.some(exit => exit.exitType === ExitType.GAME_END);
  });
  if (hasExitDoor) {
    levelGoalsArr.push('explore and find the exit');
  }
  // Capitalize first letter
  const levelGoalsText = levelGoalsArr.join(' -or- ') + '.';
  return levelGoalsText[0].toUpperCase() + levelGoalsText.slice(1);
};
