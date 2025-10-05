import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  GameArea,
  GameItem,
  GameROM,
  GameState,
  GameStateArea,
  MovementOptions,
} from '@app/features/main/interfaces/types';
import { gamesApiUrl, versionsApiUrl } from '@config/index';
import { getMoveOptions } from './utils/pathfinding';
import { STANDARD_MOVE_DURATION } from '@config/index';
import { itemDefinitions } from '@content/item-definitions';
import { propDecoDefinitions } from '@content/prop-definitions';
import { logger } from '@app/features/main/utils/logger';
import { processTurnActions } from './utils/turn-actions';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public v: string | null = null; // game version
  private gameROM = new BehaviorSubject<GameROM | null>(null);
  gameROMObs = this.gameROM.asObservable();

  private gameState = new BehaviorSubject<GameState | null>(null);
  gameStateObs = this.gameState.asObservable();

  private movementOptions = new BehaviorSubject<MovementOptions>({});
  movementOptionsObs = this.movementOptions.asObservable();

  private gameModalStatus = new BehaviorSubject<string>('');
  pageModalStatusObs = this.gameModalStatus.asObservable();

  private isLockedOut = new BehaviorSubject<boolean>(false);
  isLockedOutObs = this.isLockedOut.asObservable();

  private areaTransitionMode = new BehaviorSubject<string>('cover');
  areaTransitionModeObs = this.areaTransitionMode.asObservable();

  private exitingDirection = new BehaviorSubject<string>('');
  exitingDirectionObs = this.exitingDirection.asObservable();

  private playerAnim = new BehaviorSubject<string>('');
  playerAnimObs = this.playerAnim.asObservable();

  testInit(nextGameROM: GameROM): void {
    this.gameROM.next(nextGameROM);
  }

  testSetValue(key: string, value: unknown): void {
    switch (key) {
      case 'movementOptions':
      default:
        this.movementOptions.next(value as MovementOptions);
        break;
    }
  }

  calculateMovementOptions(nextGameState: GameState): void {
    const nextMovementOptions = getMoveOptions({
      positionKeyStart: `${nextGameState.player.y}_${nextGameState.player.x}`,
      areaMap: nextGameState.areas[nextGameState.player.areaId].map,
      areaItems: nextGameState.areas[nextGameState.player.areaId].items,
    });
    this.movementOptions.next(nextMovementOptions);
  }

  public getLocalSaveKey = (gameId: string) =>
    `save--${gameId}${this.v ? `--v${this.v}` : ''}`;

  saveLocalGameState(nextGameState: GameState): void {
    localStorage.setItem(
      this.getLocalSaveKey(nextGameState.gameId),
      JSON.stringify({
        ...nextGameState,
        lastUpdateDate: new Date().toISOString(),
      })
    );
  }

  initGameState(nextGameROM: GameROM): void {
    const nowStr = new Date().toISOString();
    const areas: any = {};
    let nextGameState: GameState;
    Object.keys(nextGameROM.content.areas).forEach((areaId: string) => {
      areas[areaId] = {
        exits: nextGameROM.content.areas[areaId].exits,
        items: nextGameROM.content.areas[areaId].items,
        props: nextGameROM.content.areas[areaId].props,
        map: nextGameROM.content.areas[areaId].map,
      };
    });
    nextGameState = {
      gameId: nextGameROM.id,
      player: {
        ...nextGameROM.content.player,
        facing: 'east',
        health: 100,
        statusActions: [],
      },
      numTurns: 0,
      flagValues: {},
      firstSaveDate: nowStr,
      lastUpdateDate: nowStr,
      areas,
    };

    const localGameStateString = localStorage.getItem(
      this.getLocalSaveKey(nextGameROM.id)
    );
    let localGameState = null;

    if (localGameStateString) {
      try {
        localGameState = JSON.parse(localGameStateString);
      } catch (err) {
        logger({
          message: 'Error parsing local storage game save',
          type: 'error',
        });
      }
    }

    if (localGameState) {
      nextGameState = localGameState;
    }

    this.gameState.next(nextGameState);
    this.calculateMovementOptions(nextGameState);
    this.saveLocalGameState(nextGameState);
  }

  loadGameROM(gameId: string | null, v?: string | null): void {
    if (gameId) {
      this.areaTransitionMode.next('cover');
      this.isLockedOut.next(true);
      fetch(`${gamesApiUrl}?id=${gameId}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
        .then(res => res.json())
        .then(data => {
          const nextGameROM = data?.item;
          if (!!v) {
            this.v = v;
            fetch(`${versionsApiUrl}?id=${v}`, {
              method: 'GET',
              headers: { Accept: 'application/json' },
            })
              .then(res => res.json())
              .then(versionData => {
                if (typeof versionData.item.content === 'string') {
                  nextGameROM.content = JSON.parse(versionData.item.content);
                }
                if (nextGameROM) {
                  this.gameROM.next(nextGameROM);
                  this.initGameState(nextGameROM);
                }
                this.isLockedOut.next(false);
              });
          } else {
            this.v = null;
            if (typeof data.item.content === 'string') {
              const contentStr: string = nextGameROM.content;
              nextGameROM.content = JSON.parse(contentStr);
            }

            if (nextGameROM) {
              this.gameROM.next(nextGameROM);
              this.initGameState(nextGameROM);
            }
            this.isLockedOut.next(false);
          }
        });
    }
  }

  getGameStateArea(areaId: string): GameStateArea | null {
    if (this.gameState.value && this.gameState.value.areas[areaId]) {
      return this.gameState.value.areas[areaId];
    }
    return null;
  }

  getArea(areaId: string): GameArea | null {
    if (this.gameROM.value && this.gameROM.value.content.areas[areaId]) {
      return this.gameROM.value.content.areas[areaId];
    }

    return null;
  }

  setPageModalStatus(status: string): void {
    this.isLockedOut.next(status !== '');
    this.areaTransitionMode.next('');
    this.gameModalStatus.next(status);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getOppositeDirection(direction: string): string {
    const mappper: { [key: string]: string } = {
      north: 'south',
      south: 'north',
      east: 'west',
      west: 'east',
    };
    return mappper[direction] ?? direction;
  }

  getCanUseItem = (itemId: string): boolean => {
    const itemDef = itemDefinitions[itemId];
    // if is KEY, is the player standing on a cell with a locked exit of a matching color?
    if (itemId.startsWith('key-')) {
      const color = itemId.split('key-')[1]; // e.g. 'silver'
      const area =
        this.gameState.value?.areas[this.gameState.value.player.areaId];
      if (!area || !this.gameState.value) {
        return false;
      }
      return area.exits.some(
        e =>
          e.x === this.gameState.value?.player.x &&
          e.y === this.gameState.value?.player.y &&
          e.lock === color
      );
    }
    return false;
  };
  turnActionExit = async (exitId: string): Promise<GameState> => {
    let nextGameState = JSON.parse(JSON.stringify(this.gameState.value));
    const areaId = nextGameState.player.areaId;
    const area = this.getArea(areaId);
    const exit = area?.exits.find(e => e.id === exitId);
    const destinationAreaId = exit?.destinationAreaId;
    if (!destinationAreaId) {
      return nextGameState;
    }
    const destinationArea = this.getArea(destinationAreaId);
    if (!destinationArea) {
      return nextGameState;
    }
    const destinationExit =
      destinationArea?.exits.find(e => e.id === exit.destinationExitId) ??
      destinationArea.exits[0] ??
      null;
    if (!destinationExit) {
      return nextGameState;
    }

    const destinationFacing = this.getOppositeDirection(
      destinationExit.direction
    );

    this.isLockedOut.next(true);

    // animate player exit
    nextGameState.player.facing = destinationFacing;
    this.gameState.next({
      ...nextGameState,
      player: {
        ...nextGameState.player,
        facing: exit.direction,
      },
    });
    this.exitingDirection.next(exit.direction);
    await this.delay(250);

    // fade out
    this.areaTransitionMode.next('cover');
    await this.delay(250);

    // move player to destination position, area, direction
    nextGameState.player.areaId = destinationAreaId;
    nextGameState.player.x = destinationExit?.x;
    nextGameState.player.y = destinationExit?.y;
    this.exitingDirection.next('');

    await this.delay(250);

    this.isLockedOut.next(false);
    this.areaTransitionMode.next('');

    return nextGameState;
  };

  turnActionMovePlayer = async (destination: string): Promise<GameState> => {
    const path = this.movementOptions.value[destination];
    let nextGameState = JSON.parse(JSON.stringify(this.gameState.value));
    if (!path || path.length < 2) {
      return this.gameState.value as GameState;
    }

    this.isLockedOut.next(true);
    for (let i = 1; i < path.length; i++) {
      const [y, x] = path[i].split('_');
      const dx = +x - nextGameState.player.x;
      const dy = +y - nextGameState.player.y;
      nextGameState.player.x = +x;
      nextGameState.player.y = +y;
      if (dx > 0) {
        nextGameState.player.facing = 'east';
      } else if (dx < 0) {
        nextGameState.player.facing = 'west';
      } else if (dy > 0) {
        nextGameState.player.facing = 'south';
      } else if (dy < 0) {
        nextGameState.player.facing = 'north';
      }
      this.playerAnim.next(`walk-${i % 2}`);
      this.gameState.next(nextGameState);
      await this.delay(STANDARD_MOVE_DURATION);
    }
    await this.delay(250);
    this.playerAnim.next('');
    this.isLockedOut.next(false);
    return this.gameState.value as GameState;
  };

  turnActionDropItem = async (itemId: string): Promise<GameState> => {
    let nextGameState = JSON.parse(JSON.stringify(this.gameState.value));
    nextGameState.player.inventory[itemId] -= 1;
    const area = nextGameState.areas[nextGameState.player.areaId];
    const positionKey = `${nextGameState.player.y}_${nextGameState.player.x}`;
    const newItem: GameItem = {
      id: `item-${Date.now()}`,
      areaId: nextGameState.player.areaId,
      itemType: itemId,
      x: nextGameState.player.x,
      y: nextGameState.player.y,
      h: this.gameROM.value!.content.areas[nextGameState.player.areaId].map[
        positionKey
      ].h,
    };
    area.items.push(newItem);
    return nextGameState;
  };

  turnActionUnlockExit = (
    nextGameState: GameState,
    use: string,
    itemId: string
  ): GameState => {
    const color = use.split('unlock-exit-')[1]; // e.g. 'silver'
    const area = nextGameState.areas[nextGameState.player.areaId];
    const exit = area.exits.find(
      e => e.x === nextGameState.player.x && e.y === nextGameState.player.y
    );
    if (exit && exit.lock === color) {
      exit.lock = '';
      nextGameState.player.inventory[itemId] = Math.max(
        nextGameState.player.inventory[itemId] - 1,
        0
      );
    }
    return nextGameState;
  };

  turnActionItemUse = (itemId: string): GameState => {
    let nextGameState = JSON.parse(JSON.stringify(this.gameState.value));
    const item = nextGameState.player.inventory[itemId];
    const use = itemDefinitions[itemId]?.use; // e.g. 'unlock-exit-silver'
    if (!item || !use) {
      return nextGameState;
    }
    if (use?.includes('unlock-exit')) {
      return this.turnActionUnlockExit(nextGameState, use, itemId);
    }
    // other uses
    return nextGameState;
  };

  turnActionPropClick = async (propId: string): Promise<GameState> => {
    let nextGameState = <GameState>(
      JSON.parse(JSON.stringify(this.gameState.value))
    );
    if (this.gameState.value === null) {
      return nextGameState;
    }
    const prop = nextGameState.areas[nextGameState.player.areaId].props.find(
      p => p.id === propId
    );
    if (prop) {
      const propDef = propDecoDefinitions[prop.propType];
      // Increment status
      if (propDef) {
        const max = propDef.statuses?.length ?? 2;
        let idx = propDef.statuses?.indexOf(prop.status ?? '') ?? 0;
        idx += 1;
        if (idx >= max) {
          idx = 0;
        }
        prop.status = propDef.statuses ? propDef.statuses[idx] : '';
      }
      nextGameState = {
        ...nextGameState,
        areas: {
          ...nextGameState.areas,
          [nextGameState.player.areaId]: {
            ...nextGameState.areas[nextGameState.player.areaId],
            props: nextGameState.areas[nextGameState.player.areaId].props.map(
              p => (p.id === propId ? prop : p)
            ),
          },
        },
      };
      nextGameState = processTurnActions(
        nextGameState,
        prop.statusActions[prop.status ?? ''] ?? []
      );

      // Process actions
      return nextGameState;
    }

    logger({
      message: `Prop ${propId} not found in area ${nextGameState.player.areaId} or prop def not found.`,
      type: 'error',
    });
    return nextGameState;
  };

  turnActionItemClick = async (itemId: string): Promise<GameState> => {
    let nextGameState = JSON.parse(JSON.stringify(this.gameState.value));

    const area = this.gameState.value?.areas[nextGameState.player.areaId];
    const item = area?.items.find(i => i.id === itemId);

    if (!item) {
      logger({
        message: `Item ${itemId} not found in area ${nextGameState.player.areaId}`,
        type: 'error',
      });
      return nextGameState;
    }

    const itemDef = itemDefinitions[item.itemType];

    if (!item) {
      logger({
        message: `Item ${itemId} not found in area ${nextGameState.player.areaId}`,
        type: 'error',
      });
      return nextGameState;
    }
    switch (itemDef.action) {
      case 'take':
      default:
        const itemDef = itemDefinitions[item.itemType];
        if (itemDef) {
          // Add item to player's inventory
          const qty = nextGameState.player.inventory[itemDef.inventoryKey] ?? 0;
          nextGameState.player.inventory[itemDef.inventoryKey] =
            qty + itemDef.amount || 1;
          // Remove item from area
          nextGameState.areas[nextGameState.player.areaId].items =
            nextGameState.areas[nextGameState.player.areaId].items.filter(
              (i: GameItem) => i.id !== itemId
            );
        }
        break;
    }
    return nextGameState;
  };

  async processTurn({
    verb,
    noun,
    amount,
  }: {
    verb: string;
    noun: string;
    amount?: number;
  }): Promise<void> {
    if (this.gameROM.value && this.gameState.value) {
      let nextGameState = JSON.parse(JSON.stringify(this.gameState.value));
      switch (verb) {
        case 'move':
          // move logic
          nextGameState = await this.turnActionMovePlayer(noun);
          break;
        case 'exit':
          // exit logic
          nextGameState = await this.turnActionExit(noun);
          break;
        case 'item-click':
          nextGameState = await this.turnActionItemClick(noun);
          break;
        case 'prop-click':
          nextGameState = await this.turnActionPropClick(noun);
          break;
        case 'item-use':
          nextGameState = await this.turnActionItemUse(noun);
          break;
        case 'item-drop':
        default:
          nextGameState = await this.turnActionDropItem(noun);
          break;
      }

      nextGameState.numTurns += 1;
      this.saveLocalGameState(nextGameState);
      this.gameState.next(nextGameState);
      this.calculateMovementOptions(nextGameState);
    }
  }
}
