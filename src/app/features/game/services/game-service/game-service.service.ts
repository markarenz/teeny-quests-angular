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
        });
    }
  }

  getArea(areaId: string): GameArea | null {
    if (this.gameROM.value && this.gameROM.value.content.areas[areaId]) {
      return this.gameROM.value.content.areas[areaId];
    }

    return null;
  }
  processTurn(verb: string, noun: string, amount: number): void {
    if (this.gameROM.value && this.gameState.value) {
      const nextGameState = this.gameState.value;
      // const nextGameROM = this.gameROM.value;

      // Move all logic to utility functions
      // const nextGameState: GameState = processTurnAction();

      this.gameState.next(nextGameState);
      this.calculateMovementOptions(this.gameROM.value, nextGameState);

      // update gameState
    }
  }
}
