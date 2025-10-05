import { GameROM, GameProp } from '@app/features/main/interfaces/types';
import { findAnOpenCell } from './common-utils';
import { v4 as uuidv4 } from 'uuid';

export const utilDeleteProp = ({
  game,
  selectedAreaId,
  propId,
}: {
  game: GameROM;
  selectedAreaId: string;
  propId: string;
}) => {
  const nextGame = { ...game } as GameROM;
  const props = game.content.areas[selectedAreaId].props;
  if (props) {
    const newProps = props.filter(prop => prop.id !== propId);
    nextGame.content.areas[selectedAreaId] = {
      ...nextGame?.content.areas[selectedAreaId],
      props: newProps,
    };
  }

  return nextGame;
};

export const utilCreateProp = ({
  game,
  selectedAreaId,
  lockouts,
}: {
  game: GameROM;
  selectedAreaId: string;
  lockouts: string[];
}): { nextGame: GameROM | null; newProp: GameProp | null } => {
  const areas = game.content.areas;
  if (areas) {
    const area = areas[selectedAreaId] ?? {
      props: [],
    };
    const openCellPosition = findAnOpenCell({ game, selectedAreaId, lockouts });
    if (openCellPosition) {
      const [y, x] = openCellPosition.split('_');
      let h = area ? area.map[openCellPosition].h : 1;

      const newProp: GameProp = {
        id: uuidv4(),
        propType: 'torch',
        wall: 'north',
        statusActions: {
          on: [],
          off: [],
        },
        areaId: selectedAreaId,
        status: 'off',
        x: +x,
        y: +y,
        h,
      };

      const nextGame = { ...game } as GameROM;
      nextGame.content.areas[selectedAreaId] = {
        ...nextGame?.content.areas[selectedAreaId],
        props: [
          ...(nextGame?.content.areas[selectedAreaId].props ?? []),
          newProp,
        ],
      };
      return { nextGame, newProp };
    }
  }
  return {
    nextGame: null,
    newProp: null,
  };
};

export const utilUpdateProp = ({
  game,
  updatedProp,
  selectedAreaId,
}: {
  game: GameROM;
  updatedProp: GameProp;
  selectedAreaId: string;
}): GameROM => {
  const id = updatedProp.id;
  const gameObj = { ...game } as GameROM;
  const area = gameObj?.content.areas[selectedAreaId];

  if (area) {
    const newProps = area.props.map(prop =>
      prop.id === id
        ? {
            ...updatedProp,
          }
        : prop
    );
    gameObj.content.areas[selectedAreaId] = {
      ...gameObj?.content.areas[selectedAreaId],
      props: newProps,
    };
  }

  return gameObj;
};
