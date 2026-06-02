import { SelectUIOption } from '@app/features/main/interfaces/types';

export const defaultFlagIdOptions: SelectUIOption[] = [
  { value: 'gameEnded', label: 'End Quest' },
  // gameLost - not selectable
];

export const booleanOptions: SelectUIOption[] = [
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' },
];
