import {
  GameEvent,
  GameEventActionCondition,
  GameROM,
  GameState,
} from '@app/features/main/interfaces/types';
import { MessageService } from '../../message/message.service';
import { AudioService } from '@app/features/main/services/audio/audio-service.service';
import { logger } from '@app/features/main/utils/logger';
import { ConditionComparison } from '@app/features/main/interfaces/enums';
import { processTurnActions } from './turn-actions';

export const processEvents = (
  nextGameState: GameState,
  gameROM: GameROM,
  audioService: AudioService,
  messageService: MessageService
) => {
  if (!gameROM.content.events) {
    return;
  }
  const events = gameROM.content.events;
  for (const event of events) {
    if (
      event.isUnidirectional &&
      nextGameState.flagValues['event_' + event.id]
    ) {
      // Skipping this event as it has already been processed
      continue;
    }
    if (checkEventConditions(event, nextGameState)) {
      if (event.isUnidirectional) {
        nextGameState.flagValues['event_' + event.id] = true;
      }
      const turnActionResult = processTurnActions(
        nextGameState,
        event.actions,
        audioService
      );
      nextGameState = turnActionResult.nextGameState;
      turnActionResult.messages.forEach(msg => {
        messageService.showMessage(msg);
      });
    }
  }
  return nextGameState;
};

export const checkEventConditions = (
  event: GameEvent,
  nextGameState: GameState
): boolean => {
  const conditions = event.conditions;
  if (!conditions) {
    return true;
  }
  return conditions.every(condition =>
    checkEventCondition(condition, nextGameState)
  );
};

export const checkEventCondition = (
  condition: GameEventActionCondition,
  nextGameState: GameState
): boolean => {
  const conditionCheckMap = new Map<string, Function>([
    ['inventory', checkConditionInventory],
    // Add more condition types here as needed...
  ]);
  const checkFunction = conditionCheckMap.get(condition.conditionType);
  if (!checkFunction || typeof checkFunction !== 'function') {
    logger({
      message: `No condition check function found for condition type: ${condition.conditionType}`,
      type: 'warn',
    });
    return false;
  }
  return checkFunction(condition, nextGameState);
};

export const checkConditionInventory = (
  condition: GameEventActionCondition,
  nextGameState: GameState
) => {
  const inventory = nextGameState.player.inventory;
  const qty = inventory[condition.identifier ?? ''] || 0;
  const comparisonQty = parseFloat(`${condition.value}`) ?? 0;
  const comparison =
    condition.comparison ?? ConditionComparison.GREATER_THAN_OR_EQUALS;
  return parseConditionComparisonNumber(qty, comparisonQty, comparison);
};

export const parseConditionComparisonNumber = (
  val1: number,
  val2: number,
  comparison: ConditionComparison
): boolean => {
  switch (comparison) {
    case ConditionComparison.EQUALS:
      return val1 === val2;
    case ConditionComparison.NOT_EQUALS:
      return val1 !== val2;
    case ConditionComparison.GREATER_THAN:
      return val1 > val2;
    case ConditionComparison.LESS_THAN:
      return val1 < val2;
    case ConditionComparison.LESS_THAN_OR_EQUALS:
      return val1 <= val2;
    default:
    case ConditionComparison.GREATER_THAN_OR_EQUALS:
      return val1 >= val2;
  }
};
