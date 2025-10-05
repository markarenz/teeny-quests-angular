import { EventAction } from '@app/features/main/interfaces/enums';
import {
  ActionEffect,
  GameArea,
  GameState,
} from '@app/features/main/interfaces/types';

export const processTurnActions = (
  nextGameState: GameState,
  actions: ActionEffect[]
): GameState => {
  let actionGameState = { ...nextGameState };
  actions.forEach(action => {
    actionGameState = processTurnAction(nextGameState, action);
  });

  return actionGameState;
};

export const processTurnAction = (
  nextGameState: GameState,
  action: ActionEffect
): GameState => {
  let actionGameState = { ...nextGameState };

  switch (action.action) {
    case EventAction.UPDATE_MAP_CELL_HEIGHT:
    case EventAction.UPDATE_MAP_CELL_FLOOR:
      actionGameState = processActionSetMapCell(actionGameState, action);
      break;
    case EventAction.SET_PROP_STATUS:
      actionGameState = processActionSetPropStatus(actionGameState, action);
      break;
    default:
      break;
  }

  return actionGameState;
};

export const processActionSetPropStatus = (
  actionGameState: GameState,
  action: ActionEffect
) => {
  const areaId = action.actionObject.areaId;
  const propId = action.actionObject.identifier;
  const newStatus = <string>action.actionValue || 'off';
  if (areaId && propId) {
    const area = <GameArea>actionGameState.areas[areaId];
    if (area && area.props) {
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
    }
  }
  return actionGameState;
};

export const processActionSetMapCell = (
  actionGameState: GameState,
  action: ActionEffect
) => {
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
  }
  return actionGameState;
};
