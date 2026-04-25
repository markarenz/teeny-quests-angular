import { ActorType } from '@app/features/main/interfaces/enums';
import { SelectIUIOption } from '@app/features/main/interfaces/types';
import { getLabelFromSlug } from '@app/features/main/utils';

export type ActorDefinition = {
  id: string;
  name: string;
  isHostile: boolean;
  maxHealth: number;
  defense: number;
  accuracy: number;
  damage: number;
  wakeRadius: number;
  sleepRadius: number;
  moveSteps: number;
};
/* 
  Defense: higher the value (0-1), herder for player to hit
  Accuracy: higher the value (0-1), easier to hit player
  Attack Round works like this:
    - Player attacks: hit = Math.random() + player.accuracy > actor.defense
    - Enemy attacks: hit = Math.random() + actor.accuracy > player.defense
  Damage: max hp for each hit (need RANGE)
  Items can have buffs to stats, but they also have buff types
    so we only have 1 buff per buff type 
    For example: onion skin armor AND plate armor = plate armor's stats
      sword: accuracy 0.5, damage 7
    Do we need an equipping system now?
*/
export const actorDefinitions: { [key: string]: ActorDefinition } = {
  slime_green: {
    id: 'slime_green',
    name: 'Green Slime',
    isHostile: true,
    maxHealth: 6,
    defense: 0.4,
    accuracy: 0.4,
    damage: 2,
    wakeRadius: 3,
    sleepRadius: 5,
    moveSteps: 2,
  },
  slime_purple: {
    id: 'slime_purple',
    name: 'Purple Slime',
    isHostile: true,
    maxHealth: 20,
    defense: 0.5,
    accuracy: 0.5,
    damage: 5,
    wakeRadius: 4,
    sleepRadius: 99,
    moveSteps: 3,
  },
};

export const actorTypeOptions: SelectIUIOption[] = Object.values(
  actorDefinitions
).map(actor => ({
  value: actor.id,
  label: actor.name,
}));
