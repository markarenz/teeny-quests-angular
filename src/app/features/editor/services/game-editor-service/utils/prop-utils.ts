import { QuestROM, QuestProp } from '@app/features/main/interfaces/types';
import { findAnOpenCell } from './common-utils';
import { v4 as uuidv4 } from 'uuid';

export const utilDeleteProp = ({
  game,
  selectedAreaId,
  propId,
}: {
  game: QuestROM;
  selectedAreaId: string;
  propId: string;
}) => {
  const nextGame = { ...game } as QuestROM;
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
  game: QuestROM;
  selectedAreaId: string;
  lockouts: string[];
}): { nextGame: QuestROM | null; newProp: QuestProp | null } => {
  const areas = game.content.areas;
  if (areas) {
    const area = areas[selectedAreaId] ?? {
      props: [],
    };
    const openCellPosition = findAnOpenCell({
      game,
      selectedAreaId,
      lockouts,
      allowNonWalkable: true,
      allowZeroHeight: true,
    });
    if (openCellPosition) {
      const [y, x] = openCellPosition.split('_');
      let h = area ? area.map[openCellPosition].h : 1;

      const newProp: QuestProp = {
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

      const nextGame = { ...game } as QuestROM;
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
  game: QuestROM;
  updatedProp: QuestProp;
  selectedAreaId: string;
}): QuestROM => {
  const id = updatedProp.id;
  const gameObj = { ...game } as QuestROM;
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
