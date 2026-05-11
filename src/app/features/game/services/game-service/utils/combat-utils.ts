import {
  Inventory,
  QuestActor,
  QuestState,
  SelectIUIOption,
} from '@app/features/main/interfaces/types';
import { AudioService } from '@app/features/main/services/audio/audio-service.service';
import { logger } from '@app/features/main/utils/logger';
import { actorDefinitions } from '@content/actor-definitions';
import { MessageService } from '../../message/message.service';
import {
  ItemWeaponDefinition,
  itemWeaponDefinitions,
} from '@content/item-definitions';
import { getIsNearPosition } from './common';
import { AnimStatus, Direction } from '@app/features/main/interfaces/enums';

// export const processPlayerCombatTurn = async (
//   gameState: QuestState,
//   combatActor: QuestActor,
//   weaponDef: ItemWeaponDefinition,
//   audioService: AudioService,
//   messageService: MessageService
// ): Promise<QuestState> => {
//   const nextGameState = structuredClone(gameState);
//   const currentArea = nextGameState.areas[nextGameState.player.areaId];
//   const actorDef = actorDefinitions[combatActor?.actorType ?? ''];
//   if (!currentArea || !combatActor || !actorDef) {
//     logger({
//       message:
//         'Current area, combat actor, or actor definition not found for combat turn',
//       type: 'error',
//     });
//     return nextGameState;
//   }

//   const playerFacing = getFacingForPosition(
//     nextGameState.player.y,
//     nextGameState.player.x,
//     combatActor.y,
//     combatActor.x
//   );
//   const actorFacing = getOppositeDirection(playerFacing);

//   combatActor.facing = actorFacing;
//   nextGameState.player.facing = playerFacing;

//   const diceRoll = Math.random();

//   const isHit = diceRoll + weaponDef.accuracy >= 0.25 + (actorDef.defense ?? 0);

//   const damage =
//     Math.ceil(
//       (weaponDef.minDamage * 100 +
//         (weaponDef.maxDamage - weaponDef.minDamage) * 100 * Math.random()) /
//         25
//     ) * 0.25;
//   const newActorHealth = Math.max(
//     Math.floor((combatActor.health - damage) * 100) / 100,
//     0
//   );

//   const message = `You attack with ${weaponDef.name}... and ${isHit ? `HIT for ${damage} damage; ${newActorHealth > 0 ? `${newActorHealth} health remain` : `The ${actorDef.name} is dead`}` : 'MISS'}!`;
//   messageService.showMessage({
//     title: 'Violence!',
//     message,
//     messageType: isHit ? 'success' : 'info',
//   });
//   if (isHit) {
//     audioService.playSound(actorDef.soundHurt);
//     nextGameState.areas[nextGameState.player.areaId].actors =
//       nextGameState.areas[nextGameState.player.areaId].actors.map(actor =>
//         actor.id === combatActor.id
//           ? {
//               ...actor,
//               health: newActorHealth,
//               animStatus:
//                 newActorHealth > 0 ? AnimStatus.SEEKING : AnimStatus.DYING,
//             }
//           : actor
//       );

//     if (newActorHealth <= 0) {
//       audioService.playSound('actor-death');
//       // TODO: drop item
//       // TODO: run actions
//     }
//   } else {
//     audioService.playSound('actor-miss');
//   }
//   return nextGameState;
// };

export const getIsPlayerNearActorCell = (
  nextGameState: QuestState
): boolean => {
  return nextGameState.areas[nextGameState.player.areaId].actors?.some(
    (a: QuestActor) =>
      getIsNearPosition(
        a.y,
        a.x,
        false,
        `${nextGameState.player.y}_${nextGameState.player.x}`
      )
  );
};

export const getWeaponOptions = (
  inventory: Inventory | undefined
): SelectIUIOption[] => {
  if (!inventory) {
    return [];
  }
  const inventoryKeys = Object.keys(inventory);
  const itemWeaponOptions: SelectIUIOption[] = Object.values(
    itemWeaponDefinitions
  )
    .filter(def => inventoryKeys.includes(def.id) || def.id === 'bareHands')
    .map(def => ({
      value: def.id,
      label: def.name,
    }));
  return itemWeaponOptions;
};

export const updateActorGameState = (
  gameState: QuestState,
  actor: QuestActor
): QuestState => {
  console.log('updating actor game state', actor.animStatus);
  const nextGameState: QuestState = {
    ...gameState,
    areas: {
      ...gameState.areas,
      [actor.areaId]: {
        ...gameState.areas[actor.areaId],
        actors: gameState.areas[actor.areaId].actors?.map(a =>
          a.id === actor.id ? actor : a
        ),
      },
    },
  };
  return nextGameState;
};

export const getFacingForPosition = (
  y1: number,
  x1: number,
  y2: number,
  x2: number
): Direction => {
  if (x1 < x2) {
    return Direction.EAST;
  } else if (x1 > x2) {
    return Direction.WEST;
  } else if (y1 < y2) {
    return Direction.SOUTH;
  } else if (y1 > y2) {
    return Direction.NORTH;
  }
  return Direction.NORTH;
};

export const getOppositeDirection = (direction: Direction): Direction => {
  switch (direction) {
    case Direction.NORTH:
      return Direction.SOUTH;
    case Direction.SOUTH:
      return Direction.NORTH;
    case Direction.EAST:
      return Direction.WEST;
    case Direction.WEST:
      return Direction.EAST;
  }
};

export const deleteActorGameState = (
  gameState: QuestState,
  actor: QuestActor
) => {
  const nextGameState: QuestState = {
    ...gameState,
    areas: {
      ...gameState.areas,
      [actor.areaId]: {
        ...gameState.areas[actor.areaId],
        actors: gameState.areas[actor.areaId].actors?.filter(
          a => a.id !== actor.id
        ),
      },
    },
  };
  return nextGameState;
};
