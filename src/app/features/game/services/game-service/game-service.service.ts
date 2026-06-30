import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  QuestArea,
  QuestAreaMap,
  QuestItem,
  QuestROM,
  QuestState,
  QuestStateArea,
  LightMap,
  MovementOptions,
  QuestActor,
  QuestProp,
  ActorShopInventoryItem,
} from '@app/features/main/interfaces/types';
import { MessageService } from '@app/features/game/services/message/message.service';
import { AuthProviderService } from '@app/features/auth/services/auth-provider-service';
import {
  activityApiUrl,
  defaultGridSize,
  gamesApiUrl,
  versionsApiUrl,
} from '@config/index';
import { getMoveOptions, getPathBetweenPoints } from './utils/pathfinding';
import { STANDARD_MOVE_DURATION } from '@config/index';
import {
  itemDefinitions,
  itemWeaponDefinitions,
} from '@content/item-definitions';
import { propDecoDefinitions } from '@content/prop-definitions';
import { logger } from '@app/features/main/utils/logger';
import { processTurnActions } from './utils/turn-actions';
import { getPositionKeysForGridSize } from '@app/features/main/utils';
import { Lights, playerCombatDefaults } from '@content/constants';
import { getAreaElementPositionStyle } from '../../lib/utils';
import { AudioService } from '@app/features/main/services/audio/audio-service.service';
import { processEvents } from './utils/event-actions';
import {
  calcScore,
  changeValueClamped,
  dropNewItem,
  getIsNearPosition,
  getLevelGoals,
  getOppositeDirection,
} from './utils/common';
import {
  ActivityType,
  ActorInteractionType,
  AnimStatus,
  Direction,
  GameStateMode,
} from '@app/features/main/interfaces/enums';
import { actorDefinitions } from '@content/actor-definitions';
import {
  calcPlayerDefense,
  deleteActorGameState,
  getBestPlayerWeapon,
  getFacingForPosition,
  getIsPlayerNearActorCell,
  updateActorGameState,
} from './utils/combat-utils';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(
    private _messageService: MessageService,
    private _audioService: AudioService,
    private authProviderService: AuthProviderService
  ) {}

  private aspectRatio: number = 1.0;
  public v: string | null = null; // game version

  private questROM = new BehaviorSubject<QuestROM | null>(null);
  gameROMObs = this.questROM.asObservable();

  private gameState = new BehaviorSubject<QuestState | null>(null);
  gameStateObs = this.gameState.asObservable();

  private score = new BehaviorSubject<number>(0);
  scoreObs = this.score.asObservable();

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

  private enteringDirection = new BehaviorSubject<string>('');
  enteringDirectionObs = this.enteringDirection.asObservable();

  private playerAnim = new BehaviorSubject<string>('');
  playerAnimObs = this.playerAnim.asObservable();

  private lightMap = new BehaviorSubject<LightMap>({});
  lightMapObs = this.lightMap.asObservable();

  private fullWidthOffsetY = new BehaviorSubject<string>('0%');
  fullWidthOffsetYObs = this.fullWidthOffsetY.asObservable();

  private levelGoals = new BehaviorSubject<string>('');
  levelGoalsObs = this.levelGoals.asObservable();

  private fullWidthOffsetX = new BehaviorSubject<string>('0%');
  fullWidthOffsetXObs = this.fullWidthOffsetX.asObservable();

  private isPlayerNearActorCell = new BehaviorSubject<boolean>(false);
  isPlayerNearActorCellObs = this.isPlayerNearActorCell.asObservable();

  private shopInventory = new BehaviorSubject<ActorShopInventoryItem[]>([]);
  shopInventoryObs = this.shopInventory.asObservable();

  private isMobile = new BehaviorSubject<boolean>(false);
  isMobileObs = this.isMobile.asObservable();

  testInit(nextGameROM: QuestROM): void {
    this.questROM.next(nextGameROM);
  }

  testSetValue(key: string, value: unknown): void {
    switch (key) {
      case 'movementOptions':
      default:
        this.movementOptions.next(value as MovementOptions);
        break;
    }
  }

  /**
   * Updates the current aspect ratio used by layout calculations in the game
   * view.
   *
   * @param aspectRatio The latest viewport or render aspect ratio.
   */
  public setAspectRatio = (aspectRatio: number) => {
    this.aspectRatio = aspectRatio;
  };

  /**
   * Synchronizes item and prop height values with the tile heights in the
   * player's current area map.
   *
   * Item heights are always refreshed. Prop heights are only updated for prop
   * definitions that do not manage their own height.
   *
   * @param nextGameState The game state whose current area entities should be
   * aligned to map height data.
   */
  setPropItemActorHeights(nextGameState: QuestState): void {
    const area = nextGameState.areas[nextGameState.player.areaId];
    const map = area.map;
    area.items.forEach((item: QuestItem) => {
      const positionKey = `${item.y}_${item.x}`;
      item.h = map[positionKey].h;
    });
    area.props.forEach((prop: QuestProp) => {
      const propDef = propDecoDefinitions[prop.propType];
      if (!propDef.canSetHeight) {
        const positionKey = `${prop.y}_${prop.x}`;
        prop.h = map[positionKey].h;
      }
    });
    area.actors.forEach((actor: QuestActor) => {
      const positionKey = `${actor.y}_${actor.x}`;
      actor.h = map[positionKey].h;
    });
    nextGameState.areas[nextGameState.player.areaId].items = area.items;
    nextGameState.areas[nextGameState.player.areaId].props = area.props;
  }

  /**
   * Recomputes the reachable movement destinations for the player's current
   * position and publishes them to `movementOptions`.
   *
   * @param nextGameState The game state used to resolve the current area map,
   * player position, and blocking items.
   */
  calculateMovementOptions(nextGameState: QuestState): void {
    if (nextGameState.areas[nextGameState.player.areaId]) {
      const nextMovementOptions = getMoveOptions({
        positionKeyStart: `${nextGameState.player.y}_${nextGameState.player.x}`,
        areaMap: nextGameState.areas[nextGameState.player.areaId].map,
        areaItems: nextGameState.areas[nextGameState.player.areaId].items,
        areaActors: nextGameState.areas[nextGameState.player.areaId].actors,
      });
      this.movementOptions.next(nextMovementOptions);
    }
  }

  /**
   * Builds the local-storage key for a game's persisted progress, including the
   * active version suffix when a version is loaded.
   *
   * @param gameId The quest identifier.
   * @returns The local-storage key used for saves for this quest/version pair.
   */
  public getLocalSaveKey = (gameId: string) =>
    `save--${gameId}${this.v ? `--v${this.v}` : ''}`;

  /**
   * Persists the current game state to local storage and refreshes its
   * `lastUpdateDate` timestamp at write time.
   *
   * @param nextGameState The game state snapshot to save locally.
   */
  saveLocalGameState(nextGameState: QuestState): void {
    localStorage.setItem(
      this.getLocalSaveKey(nextGameState.gameId),
      JSON.stringify({
        ...nextGameState,
        lastUpdateDate: new Date().toISOString(),
      })
    );
  }

  /**
   * Applies a predefined light pattern onto an existing light map at the given
   * origin point.
   *
   * Each affected cell is increased by the pattern's configured light amount,
   * scaled by `intensity`, and capped at a maximum brightness of `1.0`.
   *
   * @param y The origin row for the light pattern.
   * @param x The origin column for the light pattern.
   * @param shape The light pattern key from `Lights`.
   * @param intensity A multiplier applied to each cell's light contribution.
   * @param lightMap The mutable light map being updated.
   * @returns The updated light map instance.
   */
  public addLightToLightMap(
    y: number,
    x: number,
    shape: string,
    intensity: number,
    lightMap: LightMap
  ): LightMap {
    Lights[shape]?.forEach(cell => {
      const posKey = `${y + cell.dy}_${x + cell.dx}`;
      if (lightMap[posKey] !== undefined) {
        lightMap[posKey] = Math.min(
          1.0,
          lightMap[posKey] + (cell.lightAdd ?? 0) * intensity
        );
      }
    });
    return lightMap;
  }

  /**
   * Rebuilds the active light map for the player's current area from ambient,
   * player, and prop-based light sources.
   *
   * The calculation starts with the area's combined ambient light, applies the
   * player's personal light radius, then layers in any enabled light-emitting
   * props before publishing the finished map to `lightMap`.
   *
   * @param nextGameState The game state used to resolve the current area and
   * light-emitting entities.
   */
  public calcLightMap(nextGameState: QuestState): void {
    const positionKeys = getPositionKeysForGridSize();
    let lighting: LightMap = {};
    if (!nextGameState.areas[nextGameState.player.areaId]) {
      return;
    }
    const lightEmittingProps = nextGameState.areas[
      nextGameState.player.areaId
    ].props.filter(p => {
      const propDef = propDecoDefinitions[p.propType];
      return (
        propDef &&
        p.status === 'on' &&
        propDef.ambientLight &&
        propDef.ambientLight > 0
      );
    });
    let ambientLight = 0.0;
    lightEmittingProps.forEach(p => {
      const propDef = propDecoDefinitions[p.propType];
      if (propDef && propDef.ambientLight) {
        ambientLight += propDef.ambientLight;
      }
    });
    ambientLight = Math.min(1.0, ambientLight);

    positionKeys.forEach(pk => {
      lighting[pk] = ambientLight;
    });
    lighting = this.addLightToLightMap(
      nextGameState.player.y,
      nextGameState.player.x,
      'circle-5',
      1.0,
      lighting
    );

    lightEmittingProps.forEach(p => {
      const propDef = propDecoDefinitions[p.propType];
      const dy = p.wall === 'west' ? -1 : 0;
      const dx = p.wall === 'north' ? -1 : 0;
      lighting = this.addLightToLightMap(
        p.y + dx,
        p.x + dy,
        `${propDef.lightPattern}-${p.wall}`,
        0.5,
        lighting
      );
    });
    this.lightMap.next(lighting);
  }

  /**
   * Recomputes the full-width viewport offset from the current live game state
   * when an area map is available.
   *
   * This is a convenience wrapper around `setFullWidthOffsetXY` that reads the
   * player's current position and active area map from the service state.
   */
  public setFullWidthXYOffsetCurrent = () => {
    const gameState = this.gameState.value;
    if (gameState?.areas[gameState.player.areaId].map) {
      this.setFullWidthOffsetXY(
        gameState?.player.y ?? 0,
        gameState?.player.x ?? 0,
        gameState?.areas[gameState.player.areaId].map
      );
    }
  };

  /**
   * Calculates the vertical viewport offset for the current area so the player
   * remains framed within the full-width game layout.
   *
   * The computed value is clamped to a safe range and published as a CSS-ready
   * viewport width string through `fullWidthOffsetY` and `fullWidthOffsetX`.
   *
   * @param y The player's grid row.
   * @param x The player's grid column.
   * @param map The area map used to resolve tile height at the position.
   */
  public setFullWidthOffsetXY = (y: number, x: number, map: QuestAreaMap) => {
    if (map) {
      const positionStyles = getAreaElementPositionStyle(
        defaultGridSize,
        y,
        x,
        map[`${y}_${x}`]?.h ?? 0
      );
      const playerY = parseFloat(positionStyles.bottom.replace('%', ''));
      const offsetY = 50 - playerY + 10 * this.aspectRatio;
      const offsetYLimited = Math.min(
        Math.max(offsetY, 0),
        30 * this.aspectRatio
      );

      const playerX = parseFloat(positionStyles.left.replace('%', ''));
      const offsetX = 50 - playerX + 10 * (1 / this.aspectRatio);
      const offsetXAdjusted = -100 + offsetX * 2;
      if (this.isMobile.value) {
        this.fullWidthOffsetY.next(`${offsetYLimited}vw`);
        this.fullWidthOffsetX.next(`${offsetXAdjusted}vw`);
      } else {
        this.fullWidthOffsetY.next(`${offsetYLimited}vw`);
      }
    }
  };

  /**
   * Builds the initial in-memory game state for a quest and restores any local
   * saved progress for the same quest/version when available.
   *
   * After resolving the source state, this method refreshes all derived state
   * used by the UI and gameplay systems, including score, goals, movement
   * options, local persistence, and the current light map.
   *
   * @param nextGameROM The loaded quest definition used to seed the game state.
   */
  initGameState(nextGameROM: QuestROM): void {
    const nowStr = new Date().toISOString();
    const areas: any = {};
    let nextGameState: QuestState;
    Object.keys(nextGameROM.content.areas ?? {}).forEach((areaId: string) => {
      areas[areaId] = {
        exits: nextGameROM.content.areas[areaId].exits,
        items: nextGameROM.content.areas[areaId].items,
        props: nextGameROM.content.areas[areaId].props,
        actors: nextGameROM.content.areas[areaId].actors ?? [],
        map: nextGameROM.content.areas[areaId].map,
      };
    });
    nextGameState = {
      gameId: nextGameROM.id,
      mode: GameStateMode.DEFAULT,
      player: {
        ...nextGameROM.content.player,
        facing: Direction.EAST,
        statusActions: [],
        ...playerCombatDefaults,
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
    if (this.questROM.value) {
      this.score.next(calcScore(nextGameState, this.questROM.value));
    }
    this.gameState.next(nextGameState);
    this.levelGoals.next(getLevelGoals(nextGameROM));
    this.calculateMovementOptions(nextGameState);
    this.saveLocalGameState(nextGameState);
    this.calcLightMap(nextGameState);
  }

  /**
   * Sends a fire-and-forget activity event for analytics and progress tracking.
   *
   * Used when a quest starts or resets with the PLAY action and when a run is
   * completed with the COMPLETE action. The request is intentionally not awaited
   * so gameplay does not block on the API response.
   *
   * @param gameId The quest identifier associated with the activity.
   * @param action The activity type being recorded.
   */
  registerActivity(gameId: string, action: string): void {
    // Called on quest ROM load, progress reset (PLAY)
    // Called on game complete with initials (COMPLETE)
    // Not async because we can let this run in the background
    const userId = this.authProviderService.getUserId();
    const username = this.authProviderService.getUsername();
    fetch(activityApiUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: JSON.stringify({
        gameId,
        action,
        gameIdActivity: `${gameId}__${action}`,
        userId: userId ?? '',
        userLabel: username ?? '',
        score: this.score.value ?? 0,
        dateTime: new Date().toISOString(),
      }),
    });
  }

  /**
   * Loads a quest ROM by id, optionally replacing its content with a specific
   * saved version before initializing gameplay state.
   *
   * The method records a PLAY activity, clears any current ROM, locks input,
   * fetches the base game data, optionally fetches versioned content, then
   * seeds the service with the resolved ROM and initial state.
   *
   * @param gameId The quest identifier to load.
   * @param v An optional version identifier whose content should override the
   * base ROM content.
   */
  public loadGameROM(gameId: string | null, v?: string | null): void {
    if (this.questROM.value) {
      this.questROM.next(null);
    }
    if (gameId) {
      this.registerActivity(gameId, ActivityType.PLAY);
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
                if (typeof versionData?.item?.content === 'string') {
                  nextGameROM.content = JSON.parse(versionData.item.content);
                }
                if (nextGameROM) {
                  this.questROM.next(nextGameROM);
                  this.initGameState(nextGameROM);
                }
                this.isLockedOut.next(false);
              });
          } else {
            this.v = null;
            if (typeof data.item?.content === 'string') {
              const contentStr: string = nextGameROM.content;
              nextGameROM.content = JSON.parse(contentStr);
            }

            if (nextGameROM) {
              this.questROM.next(nextGameROM);
              this.initGameState(nextGameROM);
            }
            this.isLockedOut.next(false);
          }
        });
    }
  }

  /**
   * Returns the current mutable game-state area snapshot for the provided area
   * id when it exists.
   *
   * @param areaId The area identifier to look up in the active game state.
   * @returns The current stateful area data, or `null` if unavailable.
   */
  public getGameStateArea(areaId: string): QuestStateArea | null {
    if (this.gameState.value && this.gameState.value.areas[areaId]) {
      return this.gameState.value.areas[areaId];
    }
    return null;
  }

  /**
   * Returns the source quest area definition from the loaded ROM when present.
   *
   * @param areaId The area identifier to resolve from quest content.
   * @returns The static quest area definition, or `null` if no ROM or area is
   * available.
   */
  public getArea(areaId: string): QuestArea | null {
    if (this.questROM.value && this.questROM.value.content.areas[areaId]) {
      return this.questROM.value.content.areas[areaId];
    }

    return null;
  }

  /**
   * Updates the page modal state and synchronizes input lock and transition
   * behavior with that modal visibility.
   *
   * @param status The modal status key, or an empty string to clear the modal.
   */
  public setPageModalStatus(status: string): void {
    this.isLockedOut.next(status !== '');
    this.areaTransitionMode.next('');
    this.gameModalStatus.next(status);
  }

  /**
   * Returns a promise that resolves after the requested delay.
   *
   * @param ms The number of milliseconds to wait.
   * @returns A promise that resolves once the timeout completes.
   */
  public delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Determines whether the given inventory item is currently usable at the
   * player's position.
   *
   * Keys are usable when the player is standing on a matching locked exit.
   * Gem items are usable when the player is standing on a matching gem frame.
   *
   * @param itemId The inventory item identifier to evaluate.
   * @returns `true` when the item has a valid use at the player's current
   * location; otherwise `false`.
   */
  public getCanUseItem = (itemId: string): boolean => {
    if (itemId.startsWith('key-')) {
      const color = itemId.split('key-')[1];
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
    if (['emerald', 'diamond', 'ruby', 'sapphire'].includes(itemId)) {
      const area =
        this.gameState.value?.areas[this.gameState.value.player.areaId];
      if (!area || !this.gameState.value) {
        return false;
      }
      return area.props.some(
        p =>
          p.x === this.gameState.value?.player.x &&
          p.y === this.gameState.value?.player.y &&
          p.propType.toLowerCase().includes('frame') &&
          p.propType.toLowerCase().includes(itemId)
      );
    }
    if (['healthCookie', 'healthPotion', 'healthContainer'].includes(itemId)) {
      return true;
    }
    return false;
  };

  public processShopAction = async (
    itemId: string,
    price: number,
    actionType: 'buy' | 'sell' | 'end'
  ) => {
    let nextGameState = JSON.parse(JSON.stringify(this.gameState.value));
    let newGold = nextGameState.player.inventory['gold'] ?? 0;
    switch (actionType) {
      case 'buy':
        nextGameState.player.inventory['gold'] = newGold - price;
        nextGameState.player.inventory[itemId] =
          (nextGameState.player.inventory[itemId] ?? 0) + 1;
        this._audioService.playSound('cash');
        break;
      case 'sell':
        nextGameState.player.inventory['gold'] = newGold + price;
        nextGameState.player.inventory[itemId] =
          (nextGameState.player.inventory[itemId] ?? 0) - 1;
        this._audioService.playSound('cash');
        break;
      case 'end':
        nextGameState.mode = GameStateMode.DEFAULT;
        break;
      default:
        break;
    }

    this.gameState.next(nextGameState);
  };

  /**
   * Executes an exit transition, including animation, fade timing, area swap,
   * and game-end detection.
   *
   * @param exitId The exit identifier the player is using.
   * @returns The resulting game state after the transition completes.
   */
  public turnActionExit = async (exitId: string): Promise<QuestState> => {
    this._audioService.playSound('exit');
    let nextGameState = JSON.parse(JSON.stringify(this.gameState.value));
    const areaId = nextGameState.player.areaId;
    const area = this.getArea(areaId);
    const exit = area?.exits.find(e => e.id === exitId);
    const destinationAreaId = exit?.destinationAreaId;
    const hasAreaChanged = destinationAreaId !== areaId;

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

    const destinationFacing = getOppositeDirection(destinationExit.direction);

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

    if (exit?.exitType === 'game-end') {
      nextGameState.flagValues.gameEnded = true;
      return nextGameState;
    }

    if (hasAreaChanged) {
      // fade out
      this.areaTransitionMode.next('cover');
    }
    await this.delay(250);

    // move player to destination position, area, direction
    nextGameState.player.areaId = destinationAreaId;
    nextGameState.player.x = destinationExit?.x;
    nextGameState.player.y = destinationExit?.y;
    this.setFullWidthOffsetXY(
      nextGameState.player.y,
      nextGameState.player.x,
      destinationArea.map
    );
    this.gameState.next(nextGameState);

    await this.delay(250);
    this.enteringDirection.next(destinationExit.direction);
    this.exitingDirection.next('');

    this.calcLightMap(nextGameState);

    this.isLockedOut.next(false);
    if (hasAreaChanged) {
      this.areaTransitionMode.next('');
    }

    await this.delay(250);
    this.enteringDirection.next('');
    return nextGameState;
  };

  /**
   * Moves the player along a precomputed path to the requested destination,
   * updating facing, animation, lighting, and viewport offset along the way.
   *
   * @param destination The destination position key in `y_x` format.
   * @returns The resulting game state after movement completes.
   */
  public turnActionMovePlayer = async (
    destination: string
  ): Promise<QuestState> => {
    const path = this.movementOptions.value[destination];
    let nextGameState = JSON.parse(JSON.stringify(this.gameState.value));
    if (!path || path.length < 2) {
      return this.gameState.value as QuestState;
    }

    const [cy, cx] = destination.split('_').map(v => parseInt(v));
    const map = nextGameState.areas[nextGameState.player.areaId].map;
    this.setFullWidthOffsetXY(cy, cx, map);

    this.isLockedOut.next(true);
    for (let i = 1; i < path.length; i++) {
      if (i % 2 === 0) {
        this._audioService.playSound('step2');
      } else {
        this._audioService.playSound('step1');
      }
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
      this.calcLightMap(nextGameState);
      this.playerAnim.next(`walk-${i % 2}`);
      this.gameState.next(nextGameState);
      await this.delay(STANDARD_MOVE_DURATION);
    }
    await this.delay(250);
    this.playerAnim.next('');
    this.isLockedOut.next(false);
    return this.gameState.value as QuestState;
  };

  /**
   * Removes one unit of an inventory item and places a corresponding world item
   * at the player's current location.
   *
   * @param itemType The inventory item type being dropped.
   * @returns The updated game state with the dropped item added to the area.
   */
  public turnActionDropItem = async (itemType: string): Promise<QuestState> => {
    let nextGameState = JSON.parse(JSON.stringify(this.gameState.value));
    nextGameState.player.inventory[itemType] -= 1;
    const itemDef = itemDefinitions[itemType];
    const area = nextGameState.areas[nextGameState.player.areaId];
    const positionKey = `${nextGameState.player.y}_${nextGameState.player.x}`;
    const newItem: QuestItem = {
      id: `item-${Date.now()}`,
      areaId: nextGameState.player.areaId,
      itemType,
      x: nextGameState.player.x,
      y: nextGameState.player.y,
      h: this.questROM.value!.content.areas[nextGameState.player.areaId].map[
        positionKey
      ].h,
    };
    area.items.push(newItem);
    this._messageService.showMessage({
      title: 'Inventory Updated',
      message: `Dropped ${itemDef.name}.`,
      messageType: 'info',
    });
    return nextGameState;
  };

  public turnActionHealthPowerUp = async (
    nextGameState: QuestState,
    use: string,
    useDescription?: string
  ): Promise<QuestState> => {
    let newPlayerHealth = nextGameState.player.health;
    if (use.includes('-lg')) {
      newPlayerHealth += 4;
    } else {
      newPlayerHealth += 1;
    }
    newPlayerHealth = Math.min(
      newPlayerHealth,
      nextGameState.player.maxHealth ?? 4
    );
    nextGameState.player.health = newPlayerHealth;
    this._audioService.playSound('player-heal');
    this._messageService.showMessage({
      title: 'Health Restored',
      message: useDescription ? useDescription : 'Your health has improved.',
      messageType: 'success',
    });
    return nextGameState;
  };

  public turnActionHeartPowerUp = async (
    nextGameState: QuestState
  ): Promise<QuestState> => {
    nextGameState.player.maxHealth = Math.min(
      (nextGameState.player.maxHealth ?? 4) + 1,
      playerCombatDefaults.maxMaxHealth
    );
    nextGameState.player.health = nextGameState.player.maxHealth;
    this._audioService.playSound('player-heart');
    this._messageService.showMessage({
      title: 'Max Health Increased',
      message: 'Heart consumed! Your maximum health has increased.',
      messageType: 'success',
    });
    return nextGameState;
  };

  /**
   * Unlocks the exit at the player's position when the provided use string and
   * key item correspond to the exit's lock color.
   *
   * @param nextGameState The game state being mutated for the turn.
   * @param use The item-use descriptor containing the unlock target color.
   * @param itemId The item being used.
   * @returns The updated game state.
   */
  public turnActionUnlockExit = (
    nextGameState: QuestState,
    use: string,
    itemId: string
  ): QuestState => {
    const color = use.split('unlock-exit-')[1]; // e.g. 'silver'
    const area = nextGameState.areas[nextGameState.player.areaId];
    const exit = area.exits.find(
      e => e.x === nextGameState.player.x && e.y === nextGameState.player.y
    );
    if (exit && exit.lock === color) {
      exit.lock = '';
      this._messageService.showMessage({
        title: 'Exit Unlocked',
        message: `Unlocked the exit with the ${color} key.`,
        messageType: 'success',
      });
      this._audioService.playSound('unlock');
    }
    return nextGameState;
  };

  /**
   * Run player combat turn
   *
   * @param weaponId The weapon (inventory) item being used to attack
   * @returns The resulting game state after the item effect is applied.
   */
  public turnActionItemAttack = async (
    actorId: string
  ): Promise<QuestState> => {
    const weaponId = getBestPlayerWeapon(
      this.gameState.value?.player.inventory
    );
    let nextGameState = structuredClone(this.gameState.value)!;
    const weaponDef = itemWeaponDefinitions[weaponId];
    const actor = nextGameState.areas[nextGameState.player.areaId].actors.find(
      a => a.id === actorId
    );
    const actorDef = actor ? actorDefinitions[actor.actorType] : null;
    if (!weaponDef || !actor || !actorDef) {
      logger({
        message: `Invalid attack action: weaponId=${weaponId}, actor=${actor?.id}, actorType=${actor?.actorType}`,
        type: 'error',
      });
      return nextGameState;
    }

    this.playerAnim.next(AnimStatus.ATTACKING);
    this._audioService.playSound(weaponDef.weaponSoundId);

    const playerFacing = getFacingForPosition(
      nextGameState.player.y,
      nextGameState.player.x,
      actor.y,
      actor.x
    );
    const actorFacing = getOppositeDirection(playerFacing);
    actor.facing = actorFacing;
    nextGameState.player.facing = playerFacing;
    this.gameState.next(nextGameState);

    const diceRoll = Math.random();
    const isHit =
      diceRoll + weaponDef.accuracy >= 0.25 + (actorDef.defense ?? 0);

    const damage =
      Math.ceil(
        (weaponDef.minDamage * 100 +
          (weaponDef.maxDamage - weaponDef.minDamage) * 100 * Math.random()) /
          25
      ) * 0.25;
    const newActorHealth = Math.max(
      Math.floor((actor.health - damage) * 100) / 100,
      0
    );

    const message = `You attack with ${weaponDef.name}... and ${isHit ? `HIT for ${damage} damage; ${newActorHealth > 0 ? `${newActorHealth} health remain` : `The ${actorDef.name} is dead`}` : 'MISS'}!`;
    this._messageService.showMessage({
      title: 'Violence!',
      message,
      messageType: isHit ? 'success' : 'info',
    });

    if (isHit) {
      actor.health = newActorHealth;
      nextGameState = updateActorGameState(nextGameState, actor);
      this.gameState.next(nextGameState);
    }
    await this.delay(250);

    if (isHit) {
      actor.animStatus = AnimStatus.HURT;
      nextGameState = updateActorGameState(nextGameState, actor);
      this.gameState.next(nextGameState);

      this._audioService.playSound(actorDef.soundHurt);
      await this.delay(250);
      actor.animStatus = AnimStatus.SEEKING;
      nextGameState = updateActorGameState(nextGameState, actor);
      this.gameState.next(nextGameState);
    }

    if (newActorHealth <= 0) {
      this._audioService.playSound('actor-death');
      actor.animStatus = AnimStatus.DYING;
      nextGameState = updateActorGameState(nextGameState, actor);
      this.gameState.next(nextGameState);
      await this.delay(1000);

      nextGameState = deleteActorGameState(nextGameState, actor);

      if (actor.dropItem) {
        nextGameState = dropNewItem(
          nextGameState,
          actor.dropItem,
          actor.y,
          actor.x
        );
      }
      const turnActionResult = processTurnActions(
        nextGameState,
        actor.actions,
        this._audioService
      );
      nextGameState = turnActionResult.nextGameState;
      turnActionResult.messages.forEach(msg => {
        this._messageService.showMessage(msg);
      });

      this.gameState.next(nextGameState);
    }

    this.playerAnim.next(AnimStatus.IDLE);
    // TODO: Consumable weapons
    return nextGameState;
  };

  /**
   * Consumes an inventory item and applies its gameplay effect when the item is
   * usable in the current context.
   *
   * @param itemId The inventory item identifier being used.
   * @returns The resulting game state after the item effect is applied.
   */
  public turnActionItemUse = async (itemId: string): Promise<QuestState> => {
    let nextGameState = structuredClone(this.gameState.value)!;
    nextGameState.player.inventory[itemId] = Math.max(
      nextGameState.player.inventory[itemId] - 1,
      0
    );
    const { use, useDescription } = itemDefinitions[itemId] ?? {};
    if (!use) {
      return nextGameState;
    }
    if (use?.includes('health-')) {
      return this.turnActionHealthPowerUp(nextGameState, use, useDescription);
    }
    if (use === 'heart') {
      return this.turnActionHeartPowerUp(nextGameState);
    }
    if (use?.includes('unlock-exit')) {
      return this.turnActionUnlockExit(nextGameState, use, itemId);
    }
    if (use === 'fill-gem-frame') {
      const area = nextGameState.areas[nextGameState.player.areaId];
      const prop = area.props.find(
        p =>
          p.x === nextGameState.player.x &&
          p.y === nextGameState.player.y &&
          p.propType.toLowerCase().includes('frame') &&
          p.propType.toLowerCase().includes(itemId)
      );
      setTimeout(() => {
        this._audioService.playSound('chime');
      }, 200);

      if (prop) {
        return await this.turnActionPropSetStatus(
          nextGameState,
          prop.id,
          'filled'
        );
      }
    }
    // other uses
    return nextGameState;
  };

  /**
   * Sets a prop to a specific status, applies any resulting turn actions, and
   * refreshes lighting for the updated state.
   *
   * @param nextGameState The game state being mutated for the turn.
   * @param propId The prop identifier to update.
   * @param status The new status value to assign.
   * @returns The resulting game state after all prop status actions complete.
   */
  public turnActionPropSetStatus = async (
    nextGameState: QuestState,
    propId: string,
    status: string
  ): Promise<QuestState> => {
    const area = nextGameState.areas[nextGameState.player.areaId];
    const prop = area.props.find(p => p.id === propId);
    if (prop) {
      prop.status = status;
      nextGameState.areas[nextGameState.player.areaId].props = area.props.map(
        p => (p.id === propId ? prop : p)
      );
      const turnActionResult = processTurnActions(
        nextGameState,
        prop.statusActions[prop.status ?? ''] ?? [],
        this._audioService
      );
      nextGameState = turnActionResult.nextGameState;
      turnActionResult.messages.forEach(msg => {
        this._messageService.showMessage(msg);
      });
      this.calcLightMap(nextGameState);
      return nextGameState;
    }
    return nextGameState;
  };

  /**
   * Cycles or forces a prop's status, runs any linked turn actions, and updates
   * lighting for the changed area state.
   *
   * @param propId The prop identifier being interacted with.
   * @param forceStatus An optional explicit status override.
   * @returns The resulting game state after prop interaction processing.
   */
  public turnActionPropClick = async (
    propId: string,
    forceStatus?: string
  ): Promise<QuestState> => {
    let nextGameState = structuredClone(this.gameState.value)!;
    if (this.gameState.value === null) {
      return nextGameState;
    }
    const prop = nextGameState.areas[nextGameState.player.areaId].props.find(
      p => p.id === propId
    );
    if (prop) {
      const propDef = propDecoDefinitions[prop.propType];
      if (forceStatus) {
        prop.status = forceStatus;
      } else {
        if (propDef) {
          const max = propDef.statuses?.length ?? 2;
          let idx = propDef.statuses?.indexOf(prop.status ?? '') ?? 0;
          idx += 1;
          if (idx >= max) {
            idx = 0;
          }
          prop.status = propDef.statuses ? propDef.statuses[idx] : '';
        }
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
      const turnActionResult = processTurnActions(
        nextGameState,
        prop.statusActions[prop.status ?? ''] ?? [],
        this._audioService
      );
      this.setPropItemActorHeights(nextGameState);
      nextGameState = turnActionResult.nextGameState;
      turnActionResult.messages.forEach(msg => {
        this._messageService.showMessage(msg);
      });
      this.calcLightMap(nextGameState);
      return nextGameState;
    }

    logger({
      message: `Prop ${propId} not found in area ${nextGameState.player.areaId} or prop def not found.`,
      type: 'error',
    });
    return nextGameState;
  };

  public eraseLocalGameState(gameId: string): void {
    localStorage.removeItem(this.getLocalSaveKey(gameId));
  }
  /**
   * Clears the local save for the current quest and records a fresh PLAY
   * activity so the next load starts from the base game state.
   */
  public resetGameProgress = (): void => {
    const gameId = this.questROM.value?.id;
    if (gameId && this.questROM.value) {
      this.registerActivity(gameId, ActivityType.PLAY);
      this.eraseLocalGameState(gameId);
      this.initGameState(this.questROM.value);
    }
  };

  /**
   * Handles interaction with a world item, typically picking it up into the
   * player's inventory and removing it from the area.
   *
   * @param itemId The world item identifier being clicked.
   * @returns The resulting game state after the item interaction.
   */
  public turnActionItemClick = async (itemId: string): Promise<QuestState> => {
    let nextGameState = structuredClone(this.gameState.value)!;

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
            qty + (itemDef.amount ?? 1);
          // Remove item from area
          nextGameState.areas[nextGameState.player.areaId].items =
            nextGameState.areas[nextGameState.player.areaId].items.filter(
              (i: QuestItem) => i.id !== itemId
            );
          this._messageService.showMessage({
            title: 'Inventory Updated',
            message: `Picked up ${itemDef.name}.`,
            messageType: 'info',
          });
          setTimeout(() => {
            this._audioService.playSound('take-item');
          }, 200);
        }
        break;
    }
    return nextGameState;
  };

  public getDistance(y1: number, x1: number, y2: number, x2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  public async processActorTurn(
    nextGameState: QuestState,
    actor: QuestActor
  ): Promise<void> {
    if (nextGameState.mode === GameStateMode.DEFAULT) {
      // 1. Check if hostile idle actor should wake and seek player
      const player = nextGameState.player;
      const actorDef = actorDefinitions[actor.actorType];
      const distance = this.getDistance(actor.y, actor.x, player.y, player.x);
      if (
        actorDef &&
        actorDef.interactionType === ActorInteractionType.HOSTILE &&
        actor.animStatus === AnimStatus.IDLE &&
        distance <= (actorDef.wakeRadius ?? 0)
      ) {
        actor.animStatus = AnimStatus.SEEKING;
      } else if (
        actorDef &&
        actorDef.interactionType === ActorInteractionType.HOSTILE &&
        actor.animStatus === AnimStatus.SEEKING &&
        distance >= (actorDef.sleepRadius ?? 0)
      ) {
        actor.animStatus = AnimStatus.IDLE;
      }
      // 2. Move seeking actors along path toward player when possible
      if (actor.animStatus === AnimStatus.SEEKING) {
        const pathRaw = getPathBetweenPoints({
          start: `${actor.y}_${actor.x}`,
          end: `${player.y}_${player.x}`,
          areaMap: nextGameState.areas[nextGameState.player.areaId].map,
          areaActors: nextGameState.areas[nextGameState.player.areaId].actors,
          positionKeys: getPositionKeysForGridSize(),
        });

        // Prevent actor from moving onto player's square.
        const path = pathRaw.length > 0 ? pathRaw.slice(0, -1) : null;

        if (path && path.length) {
          const steps = path.slice(
            1,
            actorDef.moveSteps ? 1 + actorDef.moveSteps : undefined
          );
          this.isLockedOut.next(true);
          for (let i = 0; i < steps.length; i++) {
            const position = steps[i];
            const [y, x] = position.split('_').map(v => parseInt(v));
            const h =
              nextGameState.areas[nextGameState.player.areaId].map[position].h;

            const movedActor = { ...actor, y, x, h };
            nextGameState.areas[nextGameState.player.areaId].actors =
              nextGameState.areas[nextGameState.player.areaId].actors.map(
                (a: QuestActor) => (a.id === actor.id ? movedActor : a)
              );
            this.gameState.next(nextGameState);
            this._audioService.playSound(actorDef.soundMove);
            await this.delay(STANDARD_MOVE_DURATION);
            actor.x = x;
            actor.y = y;
          }
          await this.delay(250);
        }
      }
      // 3. Check if seeking actors are on the player square and should attack
      //    NOTE: Combat mode is separate and uses different turn processing
      if (
        actor.animStatus === AnimStatus.SEEKING &&
        getIsNearPosition(
          actor.y,
          actor.x,
          false,
          `${player.y}_${player.x}`,
          this.gameState.value?.areas[nextGameState.player.areaId].map
        )
      ) {
        // player, actor face each other
        const actorFacing = getFacingForPosition(
          actor.y,
          actor.x,
          player.y,
          player.x
        );
        nextGameState = updateActorGameState(nextGameState, {
          ...actor,
          animStatus: AnimStatus.ATTACKING,
          facing: actorFacing,
        });
        nextGameState.player.facing = getOppositeDirection(actorFacing);
        this._audioService.playSound(actorDef.soundAttack);

        this.gameState.next(nextGameState);

        const diceRoll = Math.random();
        const playerDefense = calcPlayerDefense(nextGameState.player);
        const isHit = diceRoll + actorDef.accuracy > 0.5 + (playerDefense ?? 0);

        // Min damage is 50% of the actorDef.damage value and the max is 100%, quantize to 0.25 increments
        const damage =
          Math.ceil(
            (actorDef.damage * 0.25 * 100 +
              actorDef.damage * 0.75 * 100 * Math.random()) /
              25
          ) * 0.25;

        this._audioService.playSound(isHit ? 'player-hurt' : 'actor-miss');

        const message = `${actorDef.name} attacks with ${actorDef.attackDescription}... and ${isHit ? `HITS for ${damage} damage` : 'MISSES'}!`;
        this._messageService.showMessage({
          title: 'Violence!',
          message,
          messageType: isHit ? 'warning' : 'info',
        });
        if (isHit) {
          nextGameState.player.health = changeValueClamped(
            nextGameState.player.health,
            -1 * damage
          );
        }
        this.gameState.next(nextGameState);
        await this.delay(200);
        this.gameState.next(
          updateActorGameState(nextGameState, {
            ...actor,
            animStatus: AnimStatus.SEEKING,
          })
        );
      }
      this.isLockedOut.next(false);
    }
  }

  /**
   * Processes all actor turns in the current area.
   *
   * @param nextGameState The current game state.
   */
  public async processActorTurns(
    nextGameState: QuestState
  ): Promise<QuestState> {
    const area = nextGameState.areas[nextGameState.player.areaId];
    const actors = area.actors ?? [];
    for (const actor of actors) {
      await this.processActorTurn(nextGameState, actor);
    }
    return nextGameState;
  }

  /**
   * Sets the shop inventory for a given actor.
   *
   * @param nextGameState The current game state.
   * @param actorId The ID of the actor whose shop inventory to retrieve.
   */
  public setShopInventory(nextGameState: QuestState, actorId: string): void {
    const actor = nextGameState.areas[nextGameState.player.areaId].actors.find(
      (a: QuestActor) => a.id === actorId
    );
    if (actor && actor.shopInventory) {
      this.shopInventory.next(actor.shopInventory);
    }
  }

  /**
   * Runs a full player turn by dispatching the requested action, processing any
   * follow-up events, and publishing all derived state updates.
   *
   * @param params The turn request containing the verb, target noun, and an
   * optional amount.
   */
  public async processTurn({
    verb,
    noun,
    amount,
  }: {
    verb: string;
    noun: string;
    amount?: number;
  }): Promise<void> {
    // this.isPlayerNearActorCell.next(false);
    if (this.questROM.value && this.gameState.value) {
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
        case 'attack':
          nextGameState = await this.turnActionItemAttack(noun);
          break;
        case 'shop':
          nextGameState.mode = GameStateMode.SHOP;
          this.setShopInventory(nextGameState, noun);
          break;
        case 'item-drop':
        default:
          nextGameState = await this.turnActionDropItem(noun);
          break;
      }

      nextGameState = processEvents(
        nextGameState,
        this.questROM.value,
        this._audioService,
        this._messageService
      );

      if (nextGameState.flagValues['gameEnded']) {
        this._audioService.playSound('game-end');
        this.eraseLocalGameState(nextGameState.gameId);
      }

      let newIsPlayerNearActorCell = getIsPlayerNearActorCell(nextGameState);

      nextGameState = await this.processActorTurns(nextGameState);

      if (nextGameState.player.health <= 0) {
        await this.delay(200);
        nextGameState.flagValues['gameLost'] = true;
        this._audioService.playSound('player-death');
        this.eraseLocalGameState(nextGameState.gameId);
      }

      nextGameState.numTurns += 1;
      this.setPropItemActorHeights(nextGameState);
      this.score.next(calcScore(nextGameState, this.questROM.value));
      if (nextGameState.mode !== GameStateMode.SHOP) {
        this.saveLocalGameState(nextGameState);
      }
      this.gameState.next(nextGameState);
      newIsPlayerNearActorCell = getIsPlayerNearActorCell(nextGameState);
      this.isPlayerNearActorCell.next(newIsPlayerNearActorCell);
      this.calculateMovementOptions(nextGameState);
    }
  }

  public setIsMobile(isMobile: boolean): void {
    this.isMobile.next(isMobile);
  }
}
