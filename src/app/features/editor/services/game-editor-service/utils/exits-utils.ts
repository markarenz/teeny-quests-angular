import { GameROM, GameAreaExit } from '@app/features/main/interfaces/types';
import { v4 as uuidv4 } from 'uuid';
import { defaultGridSize } from '@config/index';
import { findAnOpenCell } from './common-utils';

export const utilCreateExit = ({
  game,
  selectedAreaId,
}: {
  game: GameROM;
  selectedAreaId: string;
}) => {
  let destinationAreaId = '';
  const destinationExitId = '';
  const areas = game.content.areas;

  if (areas) {
  }
  const areaOptions = Object.keys(areas).filter(
    (item) => item !== selectedAreaId
  );
  destinationAreaId = areaOptions[areaOptions.length - 1];

  const area = areas[selectedAreaId] ?? {
    exits: [],
  };

  const openCellPosition = findAnOpenCell({ game, selectedAreaId });

  if (openCellPosition) {
    let xs = '0';
    let ys = '0';
    [ys, xs] = openCellPosition.split('_');
    const x = +xs;
    const y = +ys;
    let direction = 'north';
    if (y < 2) {
      direction = 'north';
    } else if (y > defaultGridSize - 3) {
      direction = 'south';
    } else if (x < 2) {
      direction = 'east';
    } else if (x > defaultGridSize - 3) {
      direction = 'west';
    }

    let h = area ? area.map[`${y}_${x}`].h : 1;

    const newExit: GameAreaExit = {
      id: uuidv4(),
      destinationAreaId,
      destinationExitId,
      exitType: 'default',
      direction,
      areaId: selectedAreaId,
      x,
      y,
      h,
      lock: '',
    };

    const nextGame = { ...game } as GameROM;
    nextGame.content.areas[selectedAreaId] = {
      ...nextGame?.content.areas[selectedAreaId],
      exits: [
        ...(nextGame?.content.areas[selectedAreaId].exits ?? []),
        newExit,
      ],
    };

    return { newExit, nextGame };
  }
  return { newExit: null, nextGame: null };
};

export const utilDeleteExit = ({
  game,
  selectedAreaId,
  exitId,
}: {
  game: GameROM;
  selectedAreaId: string;
  exitId: string;
}) => {
  const exits = game.content.areas[selectedAreaId]?.exits;
  if (exits) {
    const newExits = exits.filter((exit) => exit.id !== exitId);
    const nextGame = { ...game } as GameROM;
    nextGame.content.areas[selectedAreaId] = {
      ...nextGame?.content.areas[selectedAreaId],
      exits: newExits,
    };

    return { nextGame };
  }

  return { nextGame: null };
};

export const utilUpdateExit = ({
  game,
  selectedAreaId,
  updatedExit,
}: {
  game: GameROM;
  selectedAreaId: string;
  updatedExit: GameAreaExit;
}) => {
  const id = updatedExit.id;
  const nextGame = { ...game } as GameROM;
  const area = nextGame?.content.areas[selectedAreaId];

  if (area) {
    const newExits = area.exits.map((exit) =>
      exit.id === id
        ? {
            ...updatedExit,
            h: area.map[`${updatedExit.y}_${updatedExit.x}`].h,
          }
        : exit
    );
    nextGame.content.areas[selectedAreaId] = {
      ...nextGame?.content.areas[selectedAreaId],
      exits: newExits,
    };

    return { nextGame };
  }
  return { nextGame: null };
};
