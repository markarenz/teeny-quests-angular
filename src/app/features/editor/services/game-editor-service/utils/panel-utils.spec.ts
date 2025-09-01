import {
  utilCreatePanel,
  utilUpdatePanel,
  utilDeletePanel,
} from './panel-utils';
import gameMockData from '@app/features/editor/mocks/game.mock.json';
import { GamePanelDeco } from '@app/features/main/interfaces/types';

describe('utilDeletePanel', () => {
  it('should delete an panel', () => {
    const gameMock = JSON.parse(JSON.stringify(gameMockData));
    const panelId = 'item-1';
    gameMock.content.areas['start'].panels = [
      {
        id: panelId,
        panelDecoType: 'torch',
        areaId: 'start',
        wall: 'south',
        x: 3,
        y: 5,
        h: 1,
        status: '',
        statusEffects: {},
      },
    ];
    const selectedAreaId = 'start';
    const nextGame = utilDeletePanel({
      game: gameMock,
      selectedAreaId,
      panelId,
    });
    expect(nextGame.content.areas[selectedAreaId].panels.length).toEqual(0);
  });
});

describe('utilCreatePanel', () => {
  it('creates a new default panel in an open spot', () => {
    const gameMock = JSON.parse(JSON.stringify(gameMockData));
    const { nextGame, newPanel } = utilCreatePanel({
      game: gameMock,
      selectedAreaId: 'start',
      lockouts: [],
    });
    expect(nextGame?.content.areas['start'].panels.length).toBeGreaterThan(1);
    expect(newPanel?.id).toBeTruthy();
  });
});

describe('utilUpdatePanel', () => {
  it('should update an panel', () => {
    const gameMock = JSON.parse(JSON.stringify(gameMockData));
    const selectedAreaId = 'start';
    const panelId = 'panel1';
    const mockUpdatedPanel: GamePanelDeco = {
      id: panelId,
      panelDecoType: 'switch',
      areaId: 'start',
      statusEffects: {},
      wall: 'east',
      status: 'off',
      x: 5,
      y: 5,
      h: 1,
    };
    const nextGame = utilUpdatePanel({
      game: gameMock,
      selectedAreaId,
      updatedPanel: mockUpdatedPanel,
    });

    expect(nextGame.content.areas[selectedAreaId].panels[0]).toEqual(
      mockUpdatedPanel
    );
  });
});
