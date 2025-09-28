import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { gamesApiUrl, versionsApiUrl } from '@config/index';
import { AuthProviderService } from '@app/features/auth/services/auth-provider-service';
import { User } from '@app/features/auth/interfaces/types';
import {
  GameROM,
  GameArea,
  GameItem,
  GameAreaExit,
  GameAreaMapCell,
  SelectIUIOption,
  GameContent,
  ContentVersionListItem,
  GamePanelDeco,
} from '@app/features/main/interfaces/types';
import {
  utilDeleteItem,
  utilCreateItem,
  utilUpdateItem,
} from './utils/items-utils';
import {
  utilCreateExit,
  utilDeleteExit,
  utilUpdateExit,
} from './utils/exits-utils';
import {
  utilCreatePanel,
  utilDeletePanel,
  utilUpdatePanel,
} from './utils/panel-utils';
import { getPositionKeysForGridSize } from '@main/utils';
import { logger } from '@app/features/main/utils/logger';

@Injectable({
  providedIn: 'root',
})
export class GameEditorService {
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoadingObs = this.isLoading.asObservable();

  private games = new BehaviorSubject<GameROM[]>([]);
  gamesObs = this.games.asObservable();

  private game = new BehaviorSubject<GameROM | null>(null);
  gameObs = this.game.asObservable();

  private selectedAreaId = new BehaviorSubject<string>('');
  selectedAreaIdObs = this.selectedAreaId.asObservable();

  private selectedArea = new BehaviorSubject<GameArea | null>(null);
  selectedAreaObs = this.selectedArea.asObservable();

  private selectedCellPosition = new BehaviorSubject<string>('');
  selectedCellPositionObs = this.selectedCellPosition.asObservable();

  private selectedCell = new BehaviorSubject<GameAreaMapCell | null>(null);
  selectedCellObs = this.selectedCell.asObservable();

  private isMenuOpen = new BehaviorSubject<boolean>(false);
  isMenuOpenObs = this.isMenuOpen.asObservable();

  private selectedExitId = new BehaviorSubject<string>('');
  selectedExitIdObs = this.selectedExitId.asObservable();

  private selectedPanelId = new BehaviorSubject<string>('');
  selectedPanelIdObs = this.selectedPanelId.asObservable();

  private selectedItemId = new BehaviorSubject<string>('');
  selectedItemIdObs = this.selectedItemId.asObservable();

  private areaExits = new BehaviorSubject<GameAreaExit[]>([]);
  areaExitsObs = this.areaExits.asObservable();

  private areaItems = new BehaviorSubject<GameItem[]>([]);
  areaItemsObs = this.areaItems.asObservable();

  private areaPanels = new BehaviorSubject<GamePanelDeco[]>([]);
  areaPanelsObs = this.areaPanels.asObservable();

  private contentVersions = new BehaviorSubject<ContentVersionListItem[]>([]);
  contentVersionsObs = this.contentVersions.asObservable();

  constructor(private authProviderService: AuthProviderService) {
    this.isMenuOpen.next(false);
  }

  updateGame(game: GameROM) {
    this.game.next(game);
  }

  updateStarterInventory(newInventory: { [key: string]: number }) {
    if (this.game.value) {
      const nextGame = {
        ...this.game.value,
        content: {
          ...this.game.value.content,
          player: {
            ...this.game.value.content.player,
            inventory: newInventory,
          },
        },
      };
      this.game.next(nextGame);
    }
  }

  setTestValue(value: any, fieldName: string) {
    switch (fieldName) {
      case 'selectedAreaId': {
        this.selectedAreaId.next(value);
        break;
      }
      case 'versions': {
        this.contentVersions.next(value);
        break;
      }
      case 'game':
      default: {
        this.game.next(value);
        break;
      }
    }
  }

  toggleMenu() {
    this.isMenuOpen.next(!this.isMenuOpen.value);
  }

  setCellData(cellData: GameAreaMapCell) {
    if (this.game.value?.content.areas[this.selectedAreaId.value]) {
      const gameObj = { ...this.game.value } as GameROM;

      const exits = gameObj?.content.areas[this.selectedAreaId.value].exits.map(
        exit =>
          exit.x === cellData.x && exit.y === cellData.y
            ? { ...exit, h: cellData.h }
            : exit
      );
      const nextArea = {
        ...gameObj?.content.areas[this.selectedAreaId.value],
        map: {
          ...gameObj?.content.areas[this.selectedAreaId.value].map,
          [`${cellData.y}_${cellData.x}`]: cellData,
        },
        exits,
      };
      gameObj.content.areas[this.selectedAreaId.value] = nextArea;

      this.game.next(gameObj);
      this.selectedCell.next(cellData);
      this.selectedArea.next(nextArea);
    }
  }

  getAreaById(areaId: string): GameArea | null {
    return this.game.value?.content.areas[areaId] ?? null;
  }

  setSelectedAreaId(areaId: string) {
    this.selectedAreaId.next('');
    setTimeout(() => {
      this.selectedAreaId.next(areaId);
      this.refreshAreaExits(this.game.value as GameROM);
      this.refreshAreaItems(this.game.value as GameROM);
      this.refreshAreaPanels(this.game.value as GameROM);
    }, 100);
  }

  getPanelsForCurrentArea(): GamePanelDeco[] {
    return (
      this.game.value?.content.areas[this.selectedAreaId.value]?.panels ?? []
    );
  }

  getItemsForCurrentArea(): GameItem[] {
    return (
      this.game.value?.content.areas[this.selectedAreaId.value]?.items ?? []
    );
  }

  getExitsForCurrentArea(): GameAreaExit[] {
    return (
      this.game.value?.content.areas[this.selectedAreaId.value]?.exits ?? []
    );
  }

  // ITEMS -------------------------------------------------------------------
  refreshAreaItems(nextGame: GameROM) {
    const nextItems = [
      ...nextGame.content.areas[this.selectedAreaId.value].items,
    ];

    this.areaItems.next(nextItems);
  }

  createItem(lockouts: string[]): GameItem | null {
    if (this.game.value && this.selectedAreaId.value) {
      const { nextGame, newItem } = utilCreateItem({
        game: this.game.value,
        selectedAreaId: this.selectedAreaId.value,
        lockouts,
      });

      if (nextGame && newItem) {
        this.game.next(nextGame);
        this.refreshAreaItems(nextGame);
        this.selectedItemId.next(newItem.id);
      }
    }
    return null;
  }

  updateItem(updatedItem: GameItem) {
    if (this.game.value) {
      const nextGame = utilUpdateItem({
        game: this.game.value,
        selectedAreaId: this.selectedAreaId.value,
        updatedItem,
      });
      if (nextGame) {
        this.game.next(nextGame);
        this.refreshAreaItems(nextGame);
      }
    }
  }

  selectItem(itemId: string) {
    this.selectedItemId.next(itemId);
  }

  deleteItem(itemId: string) {
    if (this.game.value) {
      const nextGame = utilDeleteItem({
        game: this.game.value,
        selectedAreaId: this.selectedAreaId.value,
        itemId,
      });
      this.game.next(nextGame);
      this.refreshAreaItems(nextGame);
    }
  }

  // PANELS -------------------------------------------------------------------
  refreshAreaPanels(nextGame: GameROM) {
    const nextPanels = [
      ...nextGame.content.areas[this.selectedAreaId.value].panels,
    ];

    this.areaPanels.next(nextPanels);
  }

  createPanel(lockouts: string[]): GamePanelDeco | null {
    if (this.game.value && this.selectedAreaId.value) {
      const { nextGame, newPanel } = utilCreatePanel({
        game: this.game.value,
        selectedAreaId: this.selectedAreaId.value,
        lockouts,
      });

      if (nextGame && newPanel) {
        this.game.next(nextGame);
        this.refreshAreaPanels(nextGame);
        this.selectedPanelId.next(newPanel.id);
      }
    }
    return null;
  }

  updatePanel(updatedPanel: GamePanelDeco) {
    if (this.game.value) {
      const nextGame = utilUpdatePanel({
        game: this.game.value,
        selectedAreaId: this.selectedAreaId.value,
        updatedPanel,
      });
      if (nextGame) {
        this.game.next(nextGame);
        this.refreshAreaPanels(nextGame);
      }
    }
  }

  selectPanel(panelId: string) {
    this.selectedPanelId.next(panelId);
  }

  deletePanel(panelId: string) {
    if (this.game.value) {
      const nextGame = utilDeletePanel({
        game: this.game.value,
        selectedAreaId: this.selectedAreaId.value,
        panelId,
      });
      this.selectPanel('');
      this.game.next(nextGame);
      this.refreshAreaPanels(nextGame);
    }
  }

  // EXITS --------------------------------------------------------------------

  refreshAreaExits(nextGame: GameROM) {
    this.areaExits.next(
      nextGame.content.areas[this.selectedAreaId.value].exits
    );
  }

  createExit(): GameAreaExit | null {
    if (this.game.value) {
      const { newExit, nextGame } = utilCreateExit({
        game: this.game.value,
        selectedAreaId: this.selectedAreaId.value,
      });

      if (nextGame && newExit) {
        this.game.next(nextGame);
        this.selectedExitId.next(newExit.id);
        this.refreshAreaExits(nextGame as GameROM);
        return newExit;
      }
    }

    return null;
  }

  selectExit(exitId: string) {
    this.selectedExitId.next(exitId);
  }

  deleteExit(exitId: string) {
    if (this.game.value) {
      const { nextGame } = utilDeleteExit({
        game: this.game.value,
        selectedAreaId: this.selectedAreaId.value,
        exitId,
      });
      this.selectExit('');
      if (nextGame) {
        this.game.next(nextGame);
        this.refreshAreaExits(nextGame as GameROM);
      }
    }
  }

  updateExit(updatedExit: GameAreaExit) {
    if (this.game.value) {
      const { nextGame } = utilUpdateExit({
        game: this.game.value,
        selectedAreaId: this.selectedAreaId.value,
        updatedExit,
      });
      if (nextGame) {
        this.game.next(nextGame);
        this.refreshAreaExits(nextGame as GameROM);
      }
    }
  }

  // SELECTED -----------------------------------------------------------------

  setSelectedCellPosition(cellPosition: string) {
    this.selectedCellPosition.next(cellPosition);
    const area = this.game.value?.content.areas[this.selectedAreaId.value];
    this.selectedCell.next(area?.map[cellPosition] ?? null);
  }

  processGameData(rawGameData: GameROM): GameROM {
    try {
      const parsedContent = JSON.parse(`${rawGameData.content}`);
      return {
        ...rawGameData,
        content: parsedContent,
      };
    } catch (err) {
      logger({
        message: `processGameData: ${JSON.stringify(err)}`,
        type: 'error',
      });
    }
    return rawGameData;
  }

  async createGame({
    title,
    description,
    user,
  }: {
    user: User;
    title: string;
    description: string;
  }): Promise<string> {
    const { id: userId, username } = user;
    const defaultGameContent: GameContent = {
      areas: {
        start: {
          id: 'start',
          name: 'Start',
          map: this.getDefaultMap(),
          exits: [],
          items: [],
          panels: [],
        },
      },
      events: [],
      flagValues: {
        GAME_OVER: false,
        GAME_WON: false,
      },
      player: {
        x: 4,
        y: 4,
        areaId: 'start',
        inventory: {
          gold: 0,
        },
      },
    };

    const token = this.authProviderService.getToken();
    return fetch(gamesApiUrl, {
      method: 'POST',
      headers: { Accept: 'application/json', 'X-Access-Token': token || '' },
      body: JSON.stringify({
        userId: userId,
        username: username,
        itemStatus: 'draft',
        title: title,
        description: description,
        introduction: '...',
        rating: 'n/a',
        content: JSON.stringify(defaultGameContent),
      }),
    })
      .then(res => res.json())
      .then(data => {
        return data?.id ?? '';
      })
      .catch(err => {
        return '';
      });
  }

  getGamesByUserId(user: User | null): void {
    if (user) {
      this.isLoading.next(true);
      fetch(`${gamesApiUrl}?userId=${user.id}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
        .then(res => res.json())
        .then(responseObj => {
          setTimeout(() => {
            this.games.next(responseObj?.items ?? []);
            this.isLoading.next(false);
          }, 100);
        });
    }
  }

  async saveGame(game: GameROM): Promise<void> {
    const token = this.authProviderService.getToken();
    if (this.game?.value?.content) {
      return fetch(gamesApiUrl, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'X-Access-Token': token || '',
        },
        body: JSON.stringify({
          ...game,
          content: JSON.stringify(this.game.value.content),
        }),
      }).then(() => {
        return Promise.resolve();
      });
    }
  }

  getAreasListOptions(): SelectIUIOption[] {
    let areasOptions: SelectIUIOption[] = [];
    if (this.game.value) {
      const areas = this.game.value.content.areas;
      areasOptions = Object.keys(areas).map(areaId => ({
        value: areaId,
        label: areas[areaId].name,
      }));
    }
    return areasOptions;
  }

  getDestinationExitsListOptions(areaId: string): SelectIUIOption[] {
    let exitsOptions: SelectIUIOption[] = [];
    if (this.game.value) {
      const exits = this.game.value.content.areas[areaId]?.exits;
      if (exits) {
        exitsOptions = exits.map(exit => ({
          value: exit.id,
          label: `X: ${exit.x}, Y: ${
            exit.y
          } Direction: ${exit.direction.toLocaleUpperCase()}`,
        }));
      }
    }
    return exitsOptions;
  }

  getGameById(gameId: string | null): void {
    if (gameId) {
      fetch(`${gamesApiUrl}?id=${gameId}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
        .then(res => res.json())
        .then(data => {
          const nextGameData = this.processGameData(data?.item);
          const areasList = Object.keys(nextGameData.content.areas);
          this.game.next(nextGameData);
          const nextSelectedAreaId =
            nextGameData.content.player.areaId ?? areasList[0];
          this.selectedAreaId.next(nextSelectedAreaId);
          const nextSelectedArea =
            nextGameData.content.areas[nextSelectedAreaId];
          this.areaExits.next(nextSelectedArea.exits);
          this.areaItems.next(nextSelectedArea.items);
          this.areaPanels.next(nextSelectedArea.panels);
          this.selectedArea.next(nextSelectedArea);
        });
    }
  }

  getDefaultMap(): { [key: string]: GameAreaMapCell } {
    const newMap: { [key: string]: GameAreaMapCell } = {};

    const positionKeys = getPositionKeysForGridSize();

    positionKeys.forEach(key => {
      const [y, x] = key.split('_');
      const cell: GameAreaMapCell = {
        x: +x,
        y: +y,
        h: x === '0' || y === '0' ? 10 : 1,
        floor: 'default',
        wallEast: 'default',
        wallSouth: 'default',
      };
      newMap[key] = cell;
    });

    return newMap;
  }

  createArea() {
    if (this.game.value) {
      const id = uuidv4();
      const newArea: GameArea = {
        id,
        name: `Area ${id.slice(-5)}`,
        map: this.getDefaultMap(),
        exits: [],
        items: [],
        panels: [],
      };
      const nextGameData = {
        ...this.game.value,
        content: {
          ...this.game.value.content,
          areas: {
            ...this.game.value?.content.areas,
            [id]: newArea,
          },
        },
      };

      this.game.next(nextGameData);
      this.setSelectedAreaId(id);
    }
  }

  renameCurrentSelectedArea(newAreaName: string) {
    if (this.game.value) {
      const nextGameData = {
        ...this.game.value,
        content: {
          ...this.game.value.content,
          areas: {
            ...this.game.value?.content.areas,
            [this.selectedAreaId.value]: {
              ...this.game.value?.content.areas[this.selectedAreaId.value],
              name: newAreaName,
            },
          },
        },
      };
      this.game.next(nextGameData);
    }
  }

  deleteCurrentSelectedArea() {
    if (this.game.value) {
      const nextGameData = {
        ...this.game.value,
      };
      delete nextGameData.content.areas[this.selectedAreaId.value];

      const areasList = Object.keys(nextGameData.content.areas);
      this.setSelectedAreaId(areasList[0]);
      this.game.next(nextGameData);
    }
  }

  resetTexturesForCurrentArea() {
    const area = this.game.value?.content.areas[this.selectedAreaId.value];
    if (area && this.game.value) {
      const newMap = { ...area.map };
      Object.keys(newMap).forEach(key => {
        newMap[key] = {
          ...newMap[key],
          floor: 'default',
          wallEast: 'default',
          wallSouth: 'default',
        };
      });
      const nextGameData = {
        ...this.game.value,
        content: {
          ...this.game.value.content,
          areas: {
            ...this.game.value?.content.areas,
            [this.selectedAreaId.value]: {
              ...area,
              map: newMap,
            },
          },
        },
      };
      this.game.next(nextGameData);
      const currentAreaId = this.selectedAreaId.value;
      this.selectedAreaId.next('NOTHING');
      setTimeout(() => {
        this.selectedAreaId.next(currentAreaId);
      }, 100);
    }
  }

  public getContentVersionsForGame = (): void => {
    if (this.game.value) {
      const gameId = this.game.value.id;
      fetch(`${versionsApiUrl}?gameId=${gameId}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
        .then(res => res.json())
        .then(data => {
          this.contentVersions.next(data?.items ?? []);
        });
    }
  };

  public loadContentVersion = (id: string): void => {
    if (this.game.value) {
      fetch(`${versionsApiUrl}?id=${id}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
        .then(res => res.json())
        .then(data => {
          if (this.game.value) {
            const nextGameData: GameROM = {
              ...this.game.value,
              content: JSON.parse(data?.item?.content || '{}') as GameContent,
            };
            const areasList = Object.keys(nextGameData.content.areas);
            this.game.next(nextGameData);
            const nextSelectedAreaId =
              nextGameData.content.player.areaId ?? areasList[0];
            this.selectedAreaId.next(nextSelectedAreaId);
            const nextSelectedArea =
              nextGameData.content.areas[nextSelectedAreaId];
            this.areaExits.next(nextSelectedArea.exits);
            this.areaItems.next(nextSelectedArea.items);
            this.selectedArea.next(nextSelectedArea);
          }
        });
    }
  };

  public createContentVersion = async () => {
    if (this.game.value) {
      const token = this.authProviderService.getToken();
      return fetch(`${versionsApiUrl}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-Access-Token': token || '',
        },
        body: JSON.stringify({
          gameId: this.game.value.id,
          userId: this.game.value.userId,
          content: JSON.stringify(this.game.value.content),
        }),
      })
        .then(res => res.json())
        .then(() => {
          return;
        });
    }
  };
  public deleteContentVersion = async (versionId: string) => {
    if (this.game.value) {
      const token = this.authProviderService.getToken();
      return fetch(`${versionsApiUrl}?id=${versionId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'X-Access-Token': token || '',
        },
      })
        .then(res => res.json())
        .then(() => {
          return;
        });
    }
  };
}
