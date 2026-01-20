import { EventAction } from '@app/features/main/interfaces/enums';
import {
  ActionEffect,
  GameArea,
  GameState,
  ToastMessage,
} from '@app/features/main/interfaces/types';
import { AudioService } from '@app/features/main/services/audio/audio-service.service';
import { propDecoDefinitions } from '@content/prop-definitions';

export const processTurnActions = (
  nextGameState: GameState,
  actions: ActionEffect[],
  audioService: AudioService
): { nextGameState: GameState; messages: ToastMessage[] } => {
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

export const processTurnAction = (
  nextGameState: GameState,
  action: ActionEffect,
  audioService: AudioService
): { actionGameState: GameState; message: ToastMessage | null } => {
  let actionGameState = { ...nextGameState };
  let message = null;
  let processActionResult: {
    nextGameState: GameState;
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

export const processActionSetPropStatus = (
  actionGameState: GameState,
  action: ActionEffect,
  audioService: AudioService
): { nextGameState: GameState; message: ToastMessage | null } => {
  const areaId = action.actionObject.areaId;
  const propId = action.actionObject.identifier;
  const newStatus = <string>action.actionValue || 'off';
  let message = null;
  if (areaId && propId) {
    const area = <GameArea>actionGameState.areas[areaId];
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

export const processActionSetMapCell = (
  actionGameState: GameState,
  action: ActionEffect,
  audioService: AudioService
): { nextGameState: GameState; message: ToastMessage | null } => {
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
    const area = <GameArea>actionGameState.areas[areaId];
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

export const processActionSetFlag = (
  actionGameState: GameState,
  action: ActionEffect
): { nextGameState: GameState; message: ToastMessage | null } => {
  let message = null;
  const flagId = action.actionObject.identifier;
  const flagValue = action.actionValue === 'true';
  if (!flagId) {
    return { nextGameState: actionGameState, message };
  }

  if (flagId) {
    actionGameState.flagValues = {
      ...actionGameState.flagValues,
      [flagId]: flagValue,
    };
  }
  return { nextGameState: actionGameState, message };
};
