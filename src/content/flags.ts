import { SelectIUIOption } from '@app/features/main/interfaces/types';

export const defaultFlagIdOptions: SelectIUIOption[] = [
  { value: 'gameEnded', label: 'End Quest' },
  // gameLost - not selectable
];

export const booleanOptions: SelectIUIOption[] = [
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' },
];
