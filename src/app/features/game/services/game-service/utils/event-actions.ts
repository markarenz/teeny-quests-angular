import {
  QuestEvent,
  QuestEventActionCondition,
  QuestROM,
  QuestState,
} from '@app/features/main/interfaces/types';
import { MessageService } from '../../message/message.service';
import { AudioService } from '@app/features/main/services/audio/audio-service.service';
import { logger } from '@app/features/main/utils/logger';
import { ConditionComparison } from '@app/features/main/interfaces/enums';
import { processTurnActions } from './turn-actions';

/**
 * Processes events from a quest ROM and updates the game state accordingly.
 *
 * Evaluates each event's conditions and executes associated actions if conditions are met.
 * Unidirectional events are tracked to prevent duplicate processing.
 *
 * @param nextGameState - The current game state to be updated
 * @param questROM - The quest ROM containing event definitions
 * @param audioService - Service for handling audio playback
 * @param messageService - Service for displaying messages to the user
 * @returns The updated game state after all applicable events have been processed
 */
export const processEvents = (
  nextGameState: QuestState,
  questROM: QuestROM,
  audioService: AudioService,
  messageService: MessageService
) => {
  if (!questROM.content.events) {
    return;
  }
  const events = questROM.content.events;
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

/**
 * Checks if all conditions of a quest event are met in the given game state.
 * @param event - The quest event containing conditions to evaluate
 * @param nextGameState - The current game state to check conditions against
 * @returns `true` if all conditions are satisfied or no conditions exist; `false` otherwise
 */
export const checkEventConditions = (
  event: QuestEvent,
  nextGameState: QuestState
): boolean => {
  const conditions = event.conditions;
  if (!conditions) {
    return true;
  }
  return conditions.every(condition =>
    checkEventCondition(condition, nextGameState)
  );
};

/**
 * Evaluates a quest event action condition against the current game state.
 *
 * Uses a map of condition type handlers to determine which check function to execute.
 * Logs a warning if no handler is found for the specified condition type.
 *
 * @param condition - The event action condition to evaluate
 * @param nextGameState - The current quest state to check the condition against
 * @returns `true` if the condition is met, `false` otherwise
 *
 * @example
 * ```typescript
 * const condition: QuestEventActionCondition = {
 *   conditionType: 'inventory',
 *   itemId: 'sword'
 * };
 * const isMet = checkEventCondition(condition, gameState);
 * ```
 */
export const checkEventCondition = (
  condition: QuestEventActionCondition,
  nextGameState: QuestState
): boolean => {
  const conditionCheckMap = new Map<string, Function>([
    ['inventory', checkConditionInventory],
    ['flag', checkConditionFlag],
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

/**
 * Checks if a condition flag in the game state matches the expected value.
 * @param condition - The quest event action condition containing the flag identifier and expected value
 * @param nextGameState - The next game state containing the current flag values
 * @returns `true` if the flag value matches the condition's expected value, `false` otherwise
 */
export const checkConditionFlag = (
  condition: QuestEventActionCondition,
  nextGameState: QuestState
) => {
  const flagValue =
    nextGameState.flagValues[condition.identifier ?? ''] || false;
  return flagValue === condition.value;
};

/**
 * Checks if an inventory condition is met by comparing the quantity of an item in the player's inventory.
 * @param condition - The quest event action condition containing the item identifier, value, and comparison type
 * @param nextGameState - The game state containing the player's current inventory
 * @returns A boolean indicating whether the inventory condition is satisfied
 */
export const checkConditionInventory = (
  condition: QuestEventActionCondition,
  nextGameState: QuestState
) => {
  const inventory = nextGameState.player.inventory;
  const qty = inventory[condition.identifier ?? ''] || 0;
  const comparisonQty = parseFloat(`${condition.value}`) ?? 0;
  const comparison =
    condition.comparison ?? ConditionComparison.GREATER_THAN_OR_EQUALS;
  return parseConditionComparisonNumber(qty, comparisonQty, comparison);
};

/**
 * Compares two numbers based on the specified comparison operator.
 * @param val1 - The first number to compare
 * @param val2 - The second number to compare
 * @param comparison - The comparison operator to use
 * @returns `true` if the comparison evaluates to true, `false` otherwise
 * @example
 * parseConditionComparisonNumber(5, 3, ConditionComparison.GREATER_THAN) // returns true
 * parseConditionComparisonNumber(5, 5, ConditionComparison.EQUALS) // returns true
 * parseConditionComparisonNumber(5, 3, ConditionComparison.LESS_THAN) // returns false
 */
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
