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

export const playerHealthChange = (
  nextGameState: QuestState,
  delta: number,
  audioService: AudioService
) => {
  if (delta < 0) {
    audioService.playSound('player-hurt');
  }
  nextGameState.player.health = Math.max(
    Math.floor((nextGameState.player.health + delta) * 100) / 100,
    0
  );
};

export const processActorCombatTurn = (
  nextGameState: QuestState,
  combatActorId: string,
  audioService: AudioService,
  messageService: MessageService
) => {
  const player = nextGameState.player;
  const currentArea = nextGameState.areas[nextGameState.player.areaId];
  const combatActor = currentArea.actors?.find(
    actor => actor.id === combatActorId
  );
  const actorDef = actorDefinitions[combatActor?.actorType ?? ''];
  if (!currentArea || !combatActor || !actorDef) {
    logger({
      message:
        'Current area, combat actor, or actor definition not found for combat turn',
      type: 'error',
    });
    return;
  }

  const diceRoll = Math.random();
  const isHit = diceRoll + actorDef.accuracy > 0.5 + (player.defense ?? 0);

  // Min damage is 50% of the actorDef.damage value and the max is 100%, quantize to 0.25 increments
  const damage =
    Math.ceil(
      (actorDef.damage * 0.25 * 100 +
        actorDef.damage * 0.75 * 100 * Math.random()) /
        25
    ) * 0.25;

  const message = `${actorDef.name} attacks with ${actorDef.attackDescription}... and ${isHit ? `HITS for ${damage} damage` : 'MISSES'}!`;
  messageService.showMessage({
    title: 'Violence!',
    message,
    messageType: isHit ? 'warning' : 'info',
  });
  if (isHit) {
    playerHealthChange(nextGameState, -1 * damage, audioService);
  } else {
    audioService.playSound('actor-miss');
  }
};

export const processPlayerCombatTurn = (
  gameState: QuestState,
  combatActor: QuestActor,
  weaponDef: ItemWeaponDefinition,
  audioService: AudioService,
  messageService: MessageService
): QuestState => {
  const nextGameState = structuredClone(gameState);
  const currentArea = nextGameState.areas[nextGameState.player.areaId];
  const actorDef = actorDefinitions[combatActor?.actorType ?? ''];
  if (!currentArea || !combatActor || !actorDef) {
    logger({
      message:
        'Current area, combat actor, or actor definition not found for combat turn',
      type: 'error',
    });
    return nextGameState;
  }

  const diceRoll = Math.random();

  const isHit = diceRoll + weaponDef.accuracy >= 0.25 + (actorDef.defense ?? 0);

  const damage =
    Math.ceil(
      (weaponDef.minDamage * 100 +
        (weaponDef.maxDamage - weaponDef.minDamage) * 100 * Math.random()) /
        25
    ) * 0.25;
  const newActorHealth = Math.max(
    Math.floor((combatActor.health - damage) * 100) / 100,
    0
  );

  const message = `You attack with ${weaponDef.name}... and ${isHit ? `HIT for ${damage} damage; ${newActorHealth > 0 ? `${newActorHealth} health remain` : `The ${actorDef.name} is dead`}` : 'MISS'}!`;
  messageService.showMessage({
    title: 'Violence!',
    message,
    messageType: isHit ? 'success' : 'info',
  });
  if (isHit) {
    audioService.playSound(actorDef.soundHurt);
    nextGameState.areas[nextGameState.player.areaId].actors =
      nextGameState.areas[nextGameState.player.areaId].actors.map(actor =>
        actor.id === combatActor.id
          ? { ...actor, health: newActorHealth }
          : actor
      );

    if (newActorHealth <= 0) {
      // Actor is dead, remove from area
      nextGameState.areas[nextGameState.player.areaId].actors =
        currentArea.actors?.filter(a => a.id !== combatActor.id);
      audioService.playSound('actor-death');

      // TODO: drop item
      // TODO: run actions
    }
  } else {
    audioService.playSound('actor-miss');
  }
  return nextGameState;
};

export const getIsPlayerNearActorCell = (
  nextGameState: QuestState
): boolean => {
  return nextGameState.areas[nextGameState.player.areaId].actors?.some(
    (a: QuestActor) =>
      getIsNearPosition(
        a.x,
        a.y,
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
