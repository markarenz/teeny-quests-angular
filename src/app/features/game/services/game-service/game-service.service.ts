import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  GameArea,
  GameROM,
  GameState,
  MovementOptions,
} from '@app/features/main/interfaces/types';
import { gamesApiUrl } from '@config/index';
import { getMoveOptions } from './utils/pathfinding';
import { STANDARD_MOVE_DURATION } from '@config/index';
import gameMockData from '@app/features/editor/mocks/game.mock.json';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private gameROM = new BehaviorSubject<GameROM | null>(null);
  gameROMObs = this.gameROM.asObservable();

  private gameState = new BehaviorSubject<GameState | null>(null);
  gameStateObs = this.gameState.asObservable();

  private movementOptions = new BehaviorSubject<MovementOptions>({});
  movementOptionsObs = this.movementOptions.asObservable();

  private pageModalStatus = new BehaviorSubject<string>('');
  pageModalStatusObs = this.pageModalStatus.asObservable();

  private isLockedOut = new BehaviorSubject<boolean>(false);
  isLockedOutObs = this.isLockedOut.asObservable();

  private areaTransitionMode = new BehaviorSubject<string>('cover');
  areaTransitionModeObs = this.areaTransitionMode.asObservable();

  private exitingDirection = new BehaviorSubject<string>('');
  exitingDirectionObs = this.exitingDirection.asObservable();

  testInit(nextGameROM: GameROM): void {
    this.gameROM.next(nextGameROM);
    this.initGameState(nextGameROM);
  }

  testSetValue(key: string, value: unknown): void {
    switch (key) {
      case 'movementOptions':
        this.movementOptions.next(value as MovementOptions);
        break;
      default:
        break;
    }
  }

  calculateMovementOptions(
    nextGameROM: GameROM,
    nextGameState: GameState
  ): void {
    const nextMovementOptions = getMoveOptions({
      positionKeyStart: `${nextGameState.player.y}_${nextGameState.player.x}`,
      areaMap: nextGameROM.content.areas[nextGameState.player.areaId].map,
      areaItems: nextGameROM.content.areas[nextGameState.player.areaId].items,
    });
    this.movementOptions.next(nextMovementOptions);
  }

  saveLocalGameState(nextGameState: GameState): void {
    localStorage.setItem(
      `save--${nextGameState.gameId}`,
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
      };
    });
    nextGameState = {
      gameId: nextGameROM.id,
      player: {
        ...nextGameROM.content.player,
        facing: 'N',
        health: 100,
        statusEffects: [],
      },
      numTurns: 0,
      flagValues: {},
      firstSaveDate: nowStr,
      lastUpdateDate: nowStr,
      areas,
    };

    const localGameStateString = localStorage.getItem(
      `save--${nextGameROM.id}`
    );
    let localGameState = null;

    if (localGameStateString) {
      try {
        localGameState = JSON.parse(localGameStateString);
      } catch (err) {
        console.error('Error parsing local storage game save:', err);
      }
    }

    if (localGameState) {
      nextGameState = localGameState;
    }

    this.gameState.next(nextGameState);
    this.calculateMovementOptions(nextGameROM, nextGameState);
    this.saveLocalGameState(nextGameState);
  }

  loadGameROM(gameId: string | null): void {
    if (gameId) {
      this.areaTransitionMode.next('cover');
      this.isLockedOut.next(true);
      fetch(`${gamesApiUrl}?id=${gameId}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
        .then((res) => res.json())
        .then((data) => {
          const nextGameROM = data?.item;

          if (typeof data.item.content === 'string') {
            const contentStr: string = nextGameROM.content;
            nextGameROM.content = JSON.parse(contentStr);
          }

          if (nextGameROM) {
            this.gameROM.next(nextGameROM);
            this.initGameState(nextGameROM);
          }
          this.isLockedOut.next(false);
        });
    }
  }

  getArea(areaId: string): GameArea | null {
    if (this.gameROM.value && this.gameROM.value.content.areas[areaId]) {
      return this.gameROM.value.content.areas[areaId];
    }

    return null;
  }

  setPageModalStatus(status: string): void {
    this.isLockedOut.next(status !== '');
    this.areaTransitionMode.next(status !== '' ? 'cover' : '');
    this.pageModalStatus.next(status);
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

  turnActionExit = async (exitId: string): Promise<GameState> => {
    let nextGameState = JSON.parse(JSON.stringify(this.gameState.value));
    const areaId = nextGameState.player.areaId;
    const area = this.getArea(areaId);
    const exit = area?.exits.find((e) => e.id === exitId);
    const destinationAreaId = exit?.destinationAreaId;
    if (!destinationAreaId) {
      return nextGameState;
    }
    const destinationArea = this.getArea(destinationAreaId);
    if (!destinationArea) {
      return nextGameState;
    }
    const destinationExit =
      destinationArea?.exits.find((e) => e.id === exit.destinationExitId) ??
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
      this.gameState.next(nextGameState);
      await this.delay(STANDARD_MOVE_DURATION);
    }
    await this.delay(250);
    this.isLockedOut.next(false);
    return this.gameState.value as GameState;
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
        default:
          break;
      }

      nextGameState.numTurns += 1;
      this.saveLocalGameState(nextGameState);
      this.gameState.next(nextGameState);
      this.calculateMovementOptions(this.gameROM.value, nextGameState);
    }
  }
}
