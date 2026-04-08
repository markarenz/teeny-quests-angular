export enum ExitType {
  DEFAULT = 'default',
  GAME_END = 'game-end',
  CAVE = 'cave',
}

export const exitDefinitions = [
  {
    label: 'Default Exit',
    value: ExitType.DEFAULT,
  },
  {
    label: 'Cave Exit',
    value: ExitType.CAVE,
  },
  {
    label: 'Level Exit',
    value: ExitType.GAME_END,
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
