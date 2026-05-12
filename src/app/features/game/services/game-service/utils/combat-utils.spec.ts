import { Inventory } from '@app/features/main/interfaces/types';
import {
  getWeaponOptions,
  getIsPlayerNearActorCell,
  updateActorGameState,
  getFacingForPosition,
  getOppositeDirection,
  deleteActorGameState,
} from './combat-utils';
import { mockActor } from '@app/features/editor/mocks/actor.mock';
import { Direction } from '@app/features/main/interfaces/enums';

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

describe('getIsPlayerNearActorCell', () => {
  it('should return true if player is near an actor cell', () => {
    const nextGameState = {
      player: {
        areaId: 'area1',
        x: 1,
        y: 1,
      },
      areas: {
        area1: {
          actors: [{ ...mockActor, id: 'actor1', x: 2, y: 1, areaId: 'area1' }],
        },
      },
    } as any;
    const result = getIsPlayerNearActorCell(nextGameState);
    expect(result).toBe(true);
  });
});

describe('updateActorGameState', () => {
  it('should update the game state with the new actor state', () => {
    const gameState = {
      player: {
        areaId: 'area1',
        x: 1,
        y: 1,
      },
      areas: {
        area1: {
          actors: [{ ...mockActor, id: 'actor1', x: 2, y: 1, areaId: 'area1' }],
        },
      },
    } as any;
    const updatedActor = {
      ...mockActor,
      id: 'actor1',
      x: 3,
      y: 1,
      areaId: 'area1',
    };
    const nextGameState = updateActorGameState(gameState, updatedActor);
    expect(nextGameState.areas['area1'].actors?.[0].x).toBe(3);
    expect(nextGameState.areas['area1'].actors?.[0].y).toBe(1);
  });
});

describe('getFacingForPosition', () => {
  it('should return the correct facing direction', () => {
    expect(getFacingForPosition(1, 1, 1, 2)).toBe(Direction.EAST);
    expect(getFacingForPosition(1, 2, 1, 1)).toBe(Direction.WEST);
    expect(getFacingForPosition(1, 1, 2, 1)).toBe(Direction.SOUTH);
    expect(getFacingForPosition(2, 1, 1, 1)).toBe(Direction.NORTH);
    expect(getFacingForPosition(2, 1, 2, 1)).toBe(Direction.NORTH);
  });
});

describe('getOppositeDirection', () => {
  it('should return the opposite direction', () => {
    expect(getOppositeDirection(Direction.NORTH)).toBe(Direction.SOUTH);
    expect(getOppositeDirection(Direction.SOUTH)).toBe(Direction.NORTH);
    expect(getOppositeDirection(Direction.EAST)).toBe(Direction.WEST);
    expect(getOppositeDirection(Direction.WEST)).toBe(Direction.EAST);
  });
});

describe('deleteActorGameState', () => {
  it('should delete the actor from the game state', () => {
    const gameState = {
      player: {
        areaId: 'area1',
        x: 1,
        y: 1,
      },
      areas: {
        area1: {
          actors: [{ ...mockActor, id: 'actor1', x: 2, y: 1, areaId: 'area1' }],
        },
      },
    } as any;
    const actorToDelete = {
      ...mockActor,
      id: 'actor1',
      x: 2,
      y: 1,
      areaId: 'area1',
    };
    const nextGameState = deleteActorGameState(gameState, actorToDelete);
    expect(nextGameState.areas['area1'].actors).toEqual([]);
  });
});
