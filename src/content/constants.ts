import {
  LightCell,
  SelectIUIOption,
} from '@app/features/main/interfaces/types';

export const pageModalTitles: { [key: string]: string } = {
  loading: 'Loading',
  intro: 'Introduction',
  help: 'How to Play',
};

export const mapCellDecalOptions: SelectIUIOption[] = [
  { label: 'None', value: '' },
  { label: 'Overlapping Circles', value: 'overlapping-circles' },
  { label: 'Diamonds', value: 'diamonds' },
];

export const Lights: { [key: string]: LightCell[] } = {
  'circle-5': [
    { dx: 0, dy: 0, lightAdd: 1.0 },
    { dx: -1, dy: 0, lightAdd: 0.5 },
    { dx: 1, dy: 0, lightAdd: 0.5 },
    { dx: 0, dy: -1, lightAdd: 0.5 },
    { dx: 0, dy: 1, lightAdd: 0.5 },
    { dx: -2, dy: 0, lightAdd: 0.25 },
    { dx: 2, dy: 0, lightAdd: 0.25 },
    { dx: 0, dy: -2, lightAdd: 0.25 },
    { dx: 0, dy: 2, lightAdd: 0.25 },
    { dx: -1, dy: -1, lightAdd: 0.25 },
    { dx: -1, dy: 1, lightAdd: 0.25 },
    { dx: 1, dy: -1, lightAdd: 0.25 },
    { dx: 1, dy: 1, lightAdd: 0.25 },
    { dx: -1, dy: -2, lightAdd: 0.125 },
    { dx: 1, dy: -2, lightAdd: 0.125 },
    { dx: -1, dy: 2, lightAdd: 0.125 },
    { dx: 1, dy: 2, lightAdd: 0.125 },
    { dx: -2, dy: -1, lightAdd: 0.125 },
    { dx: -2, dy: 1, lightAdd: 0.125 },
    { dx: 2, dy: -1, lightAdd: 0.125 },
    { dx: 2, dy: 1, lightAdd: 0.125 },
  ],
  'half-circle-3-north': [
    { dx: 0, dy: 0, lightAdd: 1.0 },
    { dx: -1, dy: 0, lightAdd: 0.5 },
    { dx: 1, dy: 0, lightAdd: 0.5 },
    { dx: -2, dy: 0, lightAdd: 0.125 },
    { dx: 2, dy: 0, lightAdd: 0.125 },
    { dx: 0, dy: 1, lightAdd: 0.5 },
    { dx: -1, dy: 1, lightAdd: 0.25 },
    { dx: 1, dy: 1, lightAdd: 0.25 },
    { dx: 0, dy: 2, lightAdd: 0.25 },
    { dx: -1, dy: 2, lightAdd: 0.125 },
    { dx: 1, dy: 2, lightAdd: 0.125 },
  ],
  'half-circle-3-west': [
    { dx: 0, dy: 0, lightAdd: 1.0 },
    { dx: 0, dy: -1, lightAdd: 0.5 },
    { dx: 0, dy: 1, lightAdd: 0.5 },
    { dx: 0, dy: -2, lightAdd: 0.125 },
    { dx: 0, dy: 2, lightAdd: 0.125 },
    { dx: 1, dy: 0, lightAdd: 0.5 },
    { dx: 1, dy: -1, lightAdd: 0.25 },
    { dx: 1, dy: 1, lightAdd: 0.25 },
    { dx: 2, dy: 0, lightAdd: 0.25 },
    { dx: 2, dy: -1, lightAdd: 0.125 },
    { dx: 2, dy: 1, lightAdd: 0.125 },
  ],
};
