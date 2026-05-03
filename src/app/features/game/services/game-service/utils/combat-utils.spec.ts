import { Inventory } from '@app/features/main/interfaces/types';
import {
  playerHealthChange,
  processActorCombatTurn,
  processPlayerCombatTurn,
  getWeaponOptions,
} from './combat-utils';
import { mockActor } from '@app/features/editor/mocks/actor.mock';
import { itemWeaponDefinitions } from '@content/item-definitions';

describe('playerHealthChange', () => {
  it('should decrease player health and play sound if delta is negative', () => {
    const nextGameState = {
      player: { health: 4 },
    } as any;
    const audioService = {
      playSound: jasmine.createSpy('playSound'),
    } as any;
    playerHealthChange(nextGameState, -0.5, audioService);
    expect(nextGameState.player.health).toBe(3.5);
    expect(audioService.playSound).toHaveBeenCalledWith('player-hurt');
  });
  // FUTURE: healing spells, potions
});

describe('getWeaponOptions', () => {
  it('should return weapon options based on player inventory', () => {
    const inventory: Inventory = {
      gold: 10,
      bareHands: 1,
      pointyStick: 1,
    };
    const weaponOptions = getWeaponOptions(inventory);
    expect(weaponOptions).toEqual([
      { value: 'bareHands', label: 'Bare Hands' },
      { value: 'pointyStick', label: 'Pointy Stick' },
    ]);
  });
});

describe('processActorCombatTurn', () => {
  it('should process an actor combat turn and apply damage if hit', () => {
    spyOn(Math, 'random').and.returnValues(0.5, 0.999);
    const nextGameState = {
      player: { areaId: 'start', health: 4, defense: 0.1 },
      playerPosition: '0_0',
      areas: {
        start: {
          actors: [
            {
              id: 'actor1',
              actorType: 'slime_green',
              x: 0,
              y: 0,
              h: 1,
            },
          ],
        },
      },
    } as any;
    const audioService = {
      playSound: jasmine.createSpy('playSound'),
    } as any;
    const messageService = {
      showMessage: jasmine.createSpy('showMessage'),
    } as any;

    processActorCombatTurn(
      nextGameState,
      'actor1',
      audioService,
      messageService
    );

    expect(messageService.showMessage).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Violence!',
        message: jasmine.stringContaining('HITS'),
        messageType: 'warning',
      })
    );
    expect(nextGameState.player.health).toBeLessThan(4);
  });
  it('should process an actor combat turn and apply no damage if miss', () => {
    spyOn(Math, 'random').and.returnValues(0.01, 0.01);
    const nextGameState = {
      player: { areaId: 'start', health: 4, defense: 0.1 },
      playerPosition: '0_0',
      areas: {
        start: {
          actors: [
            {
              id: 'actor1',
              actorType: 'slime_green',
              x: 0,
              y: 0,
              h: 1,
            },
          ],
        },
      },
    } as any;
    const audioService = {
      playSound: jasmine.createSpy('playSound'),
    } as any;
    const messageService = {
      showMessage: jasmine.createSpy('showMessage'),
    } as any;

    processActorCombatTurn(
      nextGameState,
      'actor1',
      audioService,
      messageService
    );

    expect(messageService.showMessage).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Violence!',
        message: jasmine.stringContaining('MISSES'),
        messageType: 'info',
      })
    );
    expect(nextGameState.player.health).toBe(4);
  });

  it('should not process actor attack if input is not valid', () => {
    spyOn(Math, 'random').and.returnValues(0.01, 0.01);
    const nextGameState = {
      player: { areaId: 'start', health: 4, defense: 0.1 },
      playerPosition: '0_0',
      areas: {
        start: {
          actors: [
            {
              id: 'actor1',
              actorType: 'invalid',
              x: 0,
              y: 0,
              h: 1,
            },
          ],
        },
      },
    } as any;
    const audioService = {
      playSound: jasmine.createSpy('playSound'),
    } as any;
    const messageService = {
      showMessage: jasmine.createSpy('showMessage'),
    } as any;

    processActorCombatTurn(
      nextGameState,
      'actor1',
      audioService,
      messageService
    );

    expect(messageService.showMessage).not.toHaveBeenCalled();
    expect(nextGameState.player.health).toBe(4);
  });
});

describe('processPlayerCombatTurn', () => {
  it('should process a player combat turn and apply damage if hit', () => {
    spyOn(Math, 'random').and.returnValues(0.99, 0.99);
    const weakActor = { ...mockActor, actorType: 'slime_green', health: 0.1 };
    const nextGameState = {
      player: { areaId: 'start', health: 4, defense: 0.1 },
      playerPosition: '0_0',
      areas: {
        start: {
          actors: [weakActor],
        },
      },
    } as any;
    const audioService = {
      playSound: jasmine.createSpy('playSound'),
    } as any;
    const messageService = {
      showMessage: jasmine.createSpy('showMessage'),
    } as any;

    const weaponDef = itemWeaponDefinitions['bareHands'];

    processPlayerCombatTurn(
      nextGameState,
      weakActor,
      weaponDef,
      audioService,
      messageService
    );

    expect(messageService.showMessage).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Violence!',
        message: jasmine.stringContaining('HIT'),
        messageType: 'success',
      })
    );
  });

  it('should process a player combat turn and apply damage if miss', () => {
    spyOn(Math, 'random').and.returnValues(0.01, 0.01);
    const weakActor = { ...mockActor, actorType: 'slime_green', health: 0.1 };
    const nextGameState = {
      player: { areaId: 'start', health: 4, defense: 0.1 },
      playerPosition: '0_0',
      areas: {
        start: {
          actors: [weakActor],
        },
      },
    } as any;
    const audioService = {
      playSound: jasmine.createSpy('playSound'),
    } as any;
    const messageService = {
      showMessage: jasmine.createSpy('showMessage'),
    } as any;

    const weaponDef = itemWeaponDefinitions['bareHands'];

    processPlayerCombatTurn(
      nextGameState,
      weakActor,
      weaponDef,
      audioService,
      messageService
    );

    expect(messageService.showMessage).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Violence!',
        message: jasmine.stringContaining('MISS'),
        messageType: 'info',
      })
    );
  });

  it('should not process a player combat turn if input is not valid', () => {
    spyOn(Math, 'random').and.returnValues(0.99, 0.99);
    const invalidActor = { ...mockActor, actorType: 'invalid' };
    const nextGameState = {
      player: { areaId: 'start', health: 4, defense: 0.1 },
      playerPosition: '0_0',
      areas: {
        start: {
          actors: [invalidActor],
        },
      },
    } as any;
    const audioService = {
      playSound: jasmine.createSpy('playSound'),
    } as any;
    const messageService = {
      showMessage: jasmine.createSpy('showMessage'),
    } as any;

    const weaponDef = itemWeaponDefinitions['bareHands'];

    processPlayerCombatTurn(
      nextGameState,
      invalidActor,
      weaponDef,
      audioService,
      messageService
    );

    expect(messageService.showMessage).not.toHaveBeenCalled();
  });
});
