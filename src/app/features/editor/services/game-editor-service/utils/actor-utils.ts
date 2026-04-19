import { QuestROM, QuestActor } from '@app/features/main/interfaces/types';
import { findAnOpenCell } from './common-utils';
import { defaultGridSize } from '@config/index';
import { v4 as uuidv4 } from 'uuid';
import { ActorStatus, ActorType } from '@app/features/main/interfaces/enums';
import { actorDefinitions } from '@content/actor-definitions';

export const utilDeleteActor = ({
  game,
  selectedAreaId,
  actorId,
}: {
  game: QuestROM;
  selectedAreaId: string;
  actorId: string;
}): QuestROM => {
  const nextGame = { ...game } as QuestROM;
  console.log('>>', selectedAreaId);
  const actors = game.content.areas[selectedAreaId].actors;
  if (actors) {
    const newActors = actors.filter(actor => actor.id !== actorId);
    nextGame.content.areas[selectedAreaId] = {
      ...nextGame?.content.areas[selectedAreaId],
      actors: newActors,
    };
  }

  return nextGame;
};

export const utilCreateActor = ({
  game,
  selectedAreaId,
  lockouts,
}: {
  game: QuestROM;
  selectedAreaId: string;
  lockouts: string[];
}): { nextGame: QuestROM | null; newActor: QuestActor | null } => {
  const areas = game.content.areas;
  if (areas) {
    const area = areas[selectedAreaId] ?? {
      actors: [],
    };
    const openCellPosition = findAnOpenCell({ game, selectedAreaId, lockouts });
    console.log('openCellPosition', openCellPosition);
    if (openCellPosition) {
      const [y, x] = openCellPosition.split('_');
      let direction = 'north';
      if (+y < 2) {
        direction = 'north';
      } else if (+y > defaultGridSize - 3) {
        direction = 'south';
      } else if (+x < 2) {
        direction = 'east';
      } else if (+x > defaultGridSize - 3) {
        direction = 'west';
      }

      let h = area ? area.map[openCellPosition].h : 1;
      const defaultActorType = ActorType.SLIME_GREEN;
      const defaultActor = actorDefinitions[defaultActorType];
      const newActor: QuestActor = {
        id: uuidv4(),
        actorType: defaultActorType,
        areaId: selectedAreaId,
        actorStatus: ActorStatus.IDLE,
        health: defaultActor.maxHealth,
        x: +x,
        y: +y,
        h,
        actions: [],
      };

      const nextGame = { ...game } as QuestROM;
      nextGame.content.areas[selectedAreaId] = {
        ...nextGame?.content.areas[selectedAreaId],
        actors: [
          ...(nextGame?.content.areas[selectedAreaId].actors ?? []),
          newActor,
        ],
      };
      return { nextGame, newActor };
    }
  }
  return {
    nextGame: null,
    newActor: null,
  };
};

export const utilUpdateActor = ({
  game,
  updatedActor,
  selectedAreaId,
}: {
  game: QuestROM;
  updatedActor: QuestActor;
  selectedAreaId: string;
}): QuestROM => {
  const id = updatedActor.id;
  const gameObj = { ...game } as QuestROM;
  const area = gameObj?.content.areas[selectedAreaId];

  if (area) {
    const newActors = area.actors.map(actor =>
      actor.id === id
        ? {
            ...updatedActor,
            h: area.map[`${updatedActor.y}_${updatedActor.x}`].h,
          }
        : actor
    );
    gameObj.content.areas[selectedAreaId] = {
      ...gameObj?.content.areas[selectedAreaId],
      actors: newActors,
    };
  }
  return gameObj;
};
