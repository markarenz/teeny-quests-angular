export enum ExitType {
  DEFAULT = 'default',
  GAME_END = 'game-end',
  CAVE = 'cave',
}

export const exitDefinitions = [
  {
    label: 'Door',
    value: ExitType.DEFAULT,
  },
  {
    label: 'Level Exit',
    value: ExitType.GAME_END,
  },
  {
    label: 'Cave Exit',
    value: ExitType.CAVE,
  },
];

export const exitDirections = [
  {
    label: 'North',
    value: 'north',
  },
  {
    label: 'East',
    value: 'east',
  },
  {
    label: 'South',
    value: 'south',
  },
  {
    label: 'West',
    value: 'west',
  },
];
