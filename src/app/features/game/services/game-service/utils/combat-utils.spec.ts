import { Inventory } from '@app/features/main/interfaces/types';
import { processPlayerCombatTurn, getWeaponOptions } from './combat-utils';
import { mockActor } from '@app/features/editor/mocks/actor.mock';
import { itemWeaponDefinitions } from '@content/item-definitions';

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
