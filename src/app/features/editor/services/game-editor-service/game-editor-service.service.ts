import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { gamesApiUrl } from '@config/index';
import { User } from '@app/features/auth/interfaces/types';
import {
  Game,
  GameArea,
  GameAreaMapCell,
  SelectIUIOption,
} from '@app/features/main/interfaces/types';
import { defaultGridSize } from '@config/index';

@Injectable({
  providedIn: 'root',
})
export class GameEditorServiceService {
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoadingObs = this.isLoading.asObservable();

  private games = new BehaviorSubject<Game[]>([]);
  gamesObs = this.games.asObservable();

  private game = new BehaviorSubject<Game | null>(null);
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

  constructor() {
    this.isMenuOpen.next(false);
  }

  setTestValue(value: any, fieldName: string) {
    switch (fieldName) {
      case 'selectedAreaId': {
        this.selectedAreaId.next(value);
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
      const gameObj = { ...this.game.value } as Game;
      gameObj.content.areas[this.selectedAreaId.value] = {
        ...gameObj?.content.areas[this.selectedAreaId.value],
        map: {
          ...gameObj?.content.areas[this.selectedAreaId.value].map,
          [`${cellData.y}_${cellData.x}`]: cellData,
        },
      };
      this.game.next(gameObj);
      this.selectedCell.next(cellData);
    }
  }

  setSelectedAreaId(areaId: string) {
    this.selectedAreaId.next('');
    setTimeout(() => {
      this.selectedAreaId.next(areaId);
    }, 100);
  }

  setSelectedCellPosition(cellPosition: string) {
    this.selectedCellPosition.next(cellPosition);
    const area = this.game.value?.content.areas[this.selectedAreaId.value];
    this.selectedCell.next(area?.map[cellPosition] ?? null);
  }

  processGameData(rawGameData: Game): Game {
    try {
      const parsedContent = JSON.parse(`${rawGameData.content}`);
      return {
        ...rawGameData,
        content: parsedContent,
      };
    } catch (err) {
      console.error(`${JSON.stringify(err)}`);
    }
    return rawGameData;
  }

  getGamesByUserId(user: User | null): void {
    if (user) {
      this.isLoading.next(true);
      fetch(`${gamesApiUrl}?userId=${user.id}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
        .then((res) => res.json())
        .then((responseObj) => {
          setTimeout(() => {
            this.games.next(responseObj?.items ?? []);
            this.isLoading.next(false);
          }, 100);
        });
    }
  }

  getAreasListOptions(): SelectIUIOption[] {
    let areasOptions: SelectIUIOption[] = [];
    if (this.game.value) {
      const areas = this.game.value.content.areas;
      areasOptions = Object.keys(areas).map((areaId) => ({
        value: areaId,
        label: areas[areaId].name,
      }));
    }
    return areasOptions;
  }

  getGameById(gameId: string | null): void {
    if (gameId) {
      fetch(`${gamesApiUrl}?id=${gameId}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
        .then((res) => res.json())
        .then((data) => {
          const nextGameData = this.processGameData(data?.item);
          const areaslist = Object.keys(nextGameData.content.areas);
          this.game.next(nextGameData);
          this.selectedAreaId.next(areaslist[0]);
          this.selectedArea.next(nextGameData.content.areas[areaslist[0]]);
        });
    }
  }

  getPositionKeysForGridSize(): string[] {
    const numCells = defaultGridSize * defaultGridSize;
    return Array.from({ length: numCells }, (_, i) => {
      const x = i % defaultGridSize;
      const y = Math.floor(i / defaultGridSize);
      return `${y}_${x}`;
    });
  }

  getDefaultMap(): { [key: string]: GameAreaMapCell } {
    const newMap: { [key: string]: GameAreaMapCell } = {};

    const positionKeys = this.getPositionKeysForGridSize();

    positionKeys.forEach((key) => {
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

  createNewArea() {
    if (this.game.value) {
      const id = `${Date.now()}`;
      const newArea: GameArea = {
        id,
        name: `Area ${id.slice(-5)}`,
        map: this.getDefaultMap(),
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

      const areaslist = Object.keys(nextGameData.content.areas);
      this.setSelectedAreaId(areaslist[0]);
      this.game.next(nextGameData);
    }
  }

  resetTexturesForCurrentArea() {
    const area = this.game.value?.content.areas[this.selectedAreaId.value];
    if (area && this.game.value) {
      const newMap = { ...area.map };
      Object.keys(newMap).forEach((key) => {
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
}
