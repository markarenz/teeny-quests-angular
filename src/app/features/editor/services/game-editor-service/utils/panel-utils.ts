import { GameROM, GamePanelDeco } from '@app/features/main/interfaces/types';
import { findAnOpenCell } from './common-utils';
import { v4 as uuidv4 } from 'uuid';

export const utilDeletePanel = ({
  game,
  selectedAreaId,
  panelId,
}: {
  game: GameROM;
  selectedAreaId: string;
  panelId: string;
}) => {
  const nextGame = { ...game } as GameROM;
  const panels = game.content.areas[selectedAreaId].panels;
  if (panels) {
    const newPanels = panels.filter((panel) => panel.id !== panelId);
    nextGame.content.areas[selectedAreaId] = {
      ...nextGame?.content.areas[selectedAreaId],
      panels: newPanels,
    };
  }

  return nextGame;
};

export const utilCreatePanel = ({
  game,
  selectedAreaId,
  lockouts,
}: {
  game: GameROM;
  selectedAreaId: string;
  lockouts: string[];
}): { nextGame: GameROM | null; newPanel: GamePanelDeco | null } => {
  const areas = game.content.areas;
  if (areas) {
    const area = areas[selectedAreaId] ?? {
      panels: [],
    };
    const openCellPosition = findAnOpenCell({ game, selectedAreaId, lockouts });
    if (openCellPosition) {
      const [y, x] = openCellPosition.split('_');
      let h = area ? area.map[openCellPosition].h : 1;

      const newPanel: GamePanelDeco = {
        id: uuidv4(),
        panelDecoType: 'torch',
        wall: 'north',
        statusEffects: {},
        areaId: selectedAreaId,
        status: '',
        x: +x,
        y: +y,
        h,
      };

      const nextGame = { ...game } as GameROM;
      nextGame.content.areas[selectedAreaId] = {
        ...nextGame?.content.areas[selectedAreaId],
        panels: [
          ...(nextGame?.content.areas[selectedAreaId].panels ?? []),
          newPanel,
        ],
      };
      return { nextGame, newPanel };
    }
  }
  return {
    nextGame: null,
    newPanel: null,
  };
};

export const utilUpdatePanel = ({
  game,
  updatedPanel,
  selectedAreaId,
}: {
  game: GameROM;
  updatedPanel: GamePanelDeco;
  selectedAreaId: string;
}): GameROM => {
  const id = updatedPanel.id;
  const gameObj = { ...game } as GameROM;
  const area = gameObj?.content.areas[selectedAreaId];

  if (area) {
    const newPanels = area.panels.map((panel) =>
      panel.id === id
        ? {
            ...updatedPanel,
          }
        : panel
    );
    gameObj.content.areas[selectedAreaId] = {
      ...gameObj?.content.areas[selectedAreaId],
      panels: newPanels,
    };
  }

  return gameObj;
};
