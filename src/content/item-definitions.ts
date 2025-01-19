import { SelectIUIOption } from '@app/features/main/interfaces/types';

export type ItemDefinition = {
  id: string;
  inventoryKey: string;
  name: string;
  variant?: string;
  action?: string; // on click in area
  use?: string; // action from Inventory
  amount?: number;
};

export const itemDefinitions: { [key: string]: ItemDefinition } = {
  'key-silver': {
    id: 'key-silver',
    inventoryKey: 'key-silver',
    name: 'Silver Key',
    variant: 'silver',
    action: 'take',
    use: 'unlock-door-silver',
  },
  'coins-25': {
    id: 'coins-25',
    inventoryKey: 'gold',
    name: 'Coins',
    variant: 'gold',
    action: 'take',
    amount: 25,
  },
};
export const itemOptions: SelectIUIOption[] = [
  { value: 'key-silver', label: 'Silver Key' },
  { value: 'coins-25', label: 'Coins' },
];
