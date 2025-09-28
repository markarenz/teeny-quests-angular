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
      actionGameState = processActionSetMapCellHeight(actionGameState, action);
      break;
    case EventAction.UPDATE_MAP_CELL_FLOOR:
      break;
    default:
      break;
  }
  // action.action ===

  return actionGameState;
};

export const processActionSetMapCellHeight = (
  actionGameState: GameState,
  action: ActionEffect
) => {
  const areaId = action.actionObject.areaId;
  const positionKey = action.actionObject.identifier;
  const newHeight = parseFloat(<string>action.actionValue) || 0;
  if (areaId && positionKey) {
    const area = <GameArea>actionGameState.areas[areaId];
    if (area && area.map[positionKey]) {
      area.map[positionKey] = {
        ...area.map[positionKey],
        h: newHeight,
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
