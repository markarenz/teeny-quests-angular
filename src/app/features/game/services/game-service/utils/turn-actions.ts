import { EventAction } from '@app/features/main/interfaces/enums';
import {
  ActionEffect,
  QuestArea,
  QuestState,
  ToastMessage,
} from '@app/features/main/interfaces/types';
import { AudioService } from '@app/features/main/services/audio/audio-service.service';
import { propDecoDefinitions } from '@content/prop-definitions';

/**
 * Processes a collection of turn actions and updates the game state accordingly.
 * @param nextGameState - The current quest game state to be modified by the actions
 * @param actions - An array of action effects to be processed in sequence
 * @param audioService - The audio service used to play sounds during action processing
 * @returns An object containing the updated game state and any toast messages generated from the actions
 * @returns nextGameState - The modified quest state after all actions have been processed
 * @returns messages - An array of toast messages resulting from the processed actions
 */
export const processTurnActions = (
  nextGameState: QuestState,
  actions: ActionEffect[],
  audioService: AudioService
): { nextGameState: QuestState; messages: ToastMessage[] } => {
  const messages: ToastMessage[] = [];
  let actionGameState = { ...nextGameState };
  actions.forEach(action => {
    const processTurnActionResult = processTurnAction(
      nextGameState,
      action,
      audioService
    );
    actionGameState = processTurnActionResult.actionGameState;
    if (processTurnActionResult.message) {
      messages.push(processTurnActionResult.message);
    }
  });

  return { nextGameState: actionGameState, messages };
};

/**
 * Processes a turn action and updates the game state accordingly.
 * @param nextGameState - The current game state to be updated
 * @param action - The action effect to process
 * @param audioService - The audio service for playing sounds
 * @returns An object containing the updated game state and an optional toast message notification
 */
export const processTurnAction = (
  nextGameState: QuestState,
  action: ActionEffect,
  audioService: AudioService
): { actionGameState: QuestState; message: ToastMessage | null } => {
  let actionGameState = { ...nextGameState };
  let message = null;
  let processActionResult: {
    nextGameState: QuestState;
    message: ToastMessage | null;
  } = {
    nextGameState: actionGameState,
    message: null,
  };

  switch (action.action) {
    case EventAction.UPDATE_MAP_CELL_HEIGHT:
    case EventAction.UPDATE_MAP_CELL_FLOOR:
      processActionResult = processActionSetMapCell(
        actionGameState,
        action,
        audioService
      );
      break;
    case EventAction.SET_PROP_STATUS:
      processActionResult = processActionSetPropStatus(
        actionGameState,
        action,
        audioService
      );
      break;
    case EventAction.SET_FLAG:
      processActionResult = processActionSetFlag(actionGameState, action);
      break;
    default:
      break;
  }

  return {
    actionGameState: processActionResult.nextGameState,
    message: processActionResult.message,
  };
};

/**
 * Updates the status of a prop in a specific area and returns the updated game state with an optional message.
 *
 * @param actionGameState - The current quest state containing all areas and props
 * @param action - The action effect containing the area ID, prop identifier, and new status value
 * @param audioService - Service for playing sound effects associated with status changes
 * @returns An object containing the updated game state and an optional toast message to display
 * @returns {QuestState} nextGameState - The modified game state with the prop's new status
 * @returns {ToastMessage | null} message - A toast message if defined in the prop definition for the new status, otherwise null
 */
export const processActionSetPropStatus = (
  actionGameState: QuestState,
  action: ActionEffect,
  audioService: AudioService
): { nextGameState: QuestState; message: ToastMessage | null } => {
  const areaId = action.actionObject.areaId;
  const propId = action.actionObject.identifier;
  const newStatus = <string>action.actionValue || 'off';
  let message = null;
  if (areaId && propId) {
    const area = <QuestArea>actionGameState.areas[areaId];
    const prop = area.props.find(prop => prop.id === propId);
    if (area && area.props && prop) {
      const propDef = propDecoDefinitions[prop?.propType];
      const propIndex = area.props.findIndex(prop => prop.id === propId);
      if (propIndex !== -1) {
        area.props[propIndex] = {
          ...area.props[propIndex],
          status: newStatus,
        };
        actionGameState.areas[areaId] = {
          ...actionGameState.areas[areaId],
          props: [...area.props],
        };
      }
      if (
        propDef &&
        propDef.statusMessages &&
        propDef.statusMessages.hasOwnProperty(newStatus)
      ) {
        const statusMessage = propDef.statusMessages[newStatus];
        message = statusMessage;
        if (statusMessage.sound) {
          audioService.playSound(statusMessage.sound);
        }
      }
    }
  }
  return { nextGameState: actionGameState, message };
};

/**
 * Processes a map cell update action and applies the changes to the game state.
 *
 * Updates the height and/or floor properties of a map cell at a specified position within an area.
 * If changes are made, plays a notification sound and returns a toast message to inform the player.
 *
 * @param actionGameState - The current quest state containing all areas and their maps
 * @param action - The action effect containing the type of update and target cell information
 * @param audioService - Service for playing audio feedback
 *
 * @returns An object containing:
 *   - nextGameState: The updated game state with modified map cell properties
 *   - message: A toast message to display to the player, or null if no changes were made
 *
 * @example
 * const result = processActionSetMapCell(gameState, updateHeightAction, audioService);
 * // Returns: { nextGameState: updatedState, message: { title: 'Map Updated', ... } }
 */
export const processActionSetMapCell = (
  actionGameState: QuestState,
  action: ActionEffect,
  audioService: AudioService
): { nextGameState: QuestState; message: ToastMessage | null } => {
  let message = null;
  const areaId = action.actionObject.areaId;
  const positionKey = action.actionObject.identifier;
  let updates = {};

  if (action.action === EventAction.UPDATE_MAP_CELL_HEIGHT) {
    updates = {
      ...updates,
      h: parseFloat(<string>action.actionValue) || 0,
    };
  }
  if (action.action === EventAction.UPDATE_MAP_CELL_FLOOR) {
    updates = {
      ...updates,
      floor: <string>action.actionValue || 'default',
    };
  }

  if (areaId && positionKey) {
    const area = <QuestArea>actionGameState.areas[areaId];
    if (area && area.map[positionKey]) {
      area.map[positionKey] = {
        ...area.map[positionKey],
        ...updates,
      };
      actionGameState.areas[areaId] = {
        ...actionGameState.areas[areaId],
        map: {
          ...actionGameState.areas[areaId].map,
          [positionKey]: area.map[positionKey],
        },
      };
    }
    if (Object.keys(updates).length > 0) {
      message = <ToastMessage>{
        title: 'Map Updated',
        message: 'You hear a sound of shifting stone nearby.',
        messageType: 'warning',
      };
      audioService.playSound('stone');
    }
  }
  return { nextGameState: actionGameState, message };
};

/**
 * Processes a flag-setting action and updates the game state accordingly.
 * @param actionGameState - The current quest state to be updated
 * @param action - The action effect containing the flag identifier and value to set
 * @returns An object containing the updated game state and an optional toast message
 * @throws Does not throw, but returns the unmodified state if flagId is missing
 */
export const processActionSetFlag = (
  actionGameState: QuestState,
  action: ActionEffect
): { nextGameState: QuestState; message: ToastMessage | null } => {
  let message = null;
  const flagId = action.actionObject.identifier;
  const flagValue = action.actionValue === 'true';
  if (!flagId) {
    return { nextGameState: actionGameState, message };
  }

  actionGameState.flagValues = {
    ...actionGameState.flagValues,
    [flagId]: flagValue,
  };
  return { nextGameState: actionGameState, message };
};
