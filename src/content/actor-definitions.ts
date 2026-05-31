import { ActorInteractionType } from '@app/features/main/interfaces/enums';
import { SelectIUIOption } from '@app/features/main/interfaces/types';

export type ActorDefinition = {
  id: string;
  name: string;
  interactionType: ActorInteractionType;
  maxHealth: number;
  defense: number;
  accuracy: number;
  damage: number;
  wakeRadius: number;
  sleepRadius: number;
  moveSteps: number;
  soundAttack: string;
  soundMove: string;
  soundHurt: string;
  soundDeath: string;
  attackDescription: string;
  size: 'sm' | 'md' | 'lg';
  buttonTop: string;
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
  slimeGreen: {
    id: 'slimeGreen',
    name: 'Green Slime',
    interactionType: ActorInteractionType.HOSTILE,
    maxHealth: 2,
    defense: 0.1,
    accuracy: 0.3,
    damage: 0.5,
    wakeRadius: 3,
    sleepRadius: 5,
    moveSteps: 2,
    soundAttack: 'attack',
    soundMove: 'slime-move',
    soundHurt: 'actor-hurt',
    soundDeath: 'slime-death',
    attackDescription: 'slimy jab',
    size: 'sm',
    buttonTop: '45%',
  },
  behtt: {
    id: 'behtt',
    name: 'Behtt',
    interactionType: ActorInteractionType.HOSTILE,
    maxHealth: 3,
    defense: 0.3,
    accuracy: 0.3,
    damage: 1,
    wakeRadius: 3,
    sleepRadius: 5,
    moveSteps: 4,
    soundAttack: 'actor-bite',
    soundMove: 'behtt-move',
    soundHurt: 'actor-hurt',
    soundDeath: 'actor-death',
    attackDescription: 'toothy bite',
    size: 'sm',
    buttonTop: '35%',
  },
  skello: {
    id: 'skello',
    name: 'Skello',
    interactionType: ActorInteractionType.HOSTILE,
    maxHealth: 5,
    defense: 0.2,
    accuracy: 0.4,
    damage: 1,
    wakeRadius: 4,
    sleepRadius: 99,
    moveSteps: 4,
    soundAttack: 'actor-bite',
    soundMove: 'skello-move',
    soundHurt: 'actor-hurt',
    soundDeath: 'slime-death',
    attackDescription: 'boney punch',
    size: 'md',
    buttonTop: '10%',
  },
  skelloKing: {
    id: 'skelloKing',
    name: 'Skello King',
    interactionType: ActorInteractionType.HOSTILE,
    maxHealth: 10,
    defense: 0.4,
    accuracy: 0.4,
    damage: 3,
    wakeRadius: 4,
    sleepRadius: 99,
    moveSteps: 4,
    soundAttack: 'actor-bite',
    soundMove: 'skello-move',
    soundHurt: 'actor-hurt',
    soundDeath: 'actor-death',
    attackDescription: 'bone crusher',
    size: 'md',
    buttonTop: '10%',
  },
};

export const actorTypeOptions: SelectIUIOption[] = Object.values(
  actorDefinitions
).map(actor => ({
  value: actor.id,
  label: actor.name,
}));
