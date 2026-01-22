import { SelectIUIOption } from '@app/features/main/interfaces/types';
import { getLabelFromSlug } from '@app/features/main/utils';

export type ItemDefinition = {
  id: string;
  inventoryKey: string;
  name: string;
  variant?: string;
  action?: string; // on click in area
  use?: string; // action from Inventory
  amount?: number;
  inventoryActions: string[]; // actions available in inventory
};

export const itemDefinitions: { [key: string]: ItemDefinition } = {
  'key-silver': {
    id: 'key-silver',
    inventoryKey: 'key-silver',
    name: 'Silver Key',
    variant: 'silver',
    action: 'take',
    use: 'unlock-exit-silver',
    inventoryActions: ['use', 'drop'],
  },
  'key-gold': {
    id: 'key-gold',
    inventoryKey: 'key-gold',
    name: 'Gold Key',
    variant: 'gold',
    action: 'take',
    use: 'unlock-exit-gold',
    inventoryActions: ['use', 'drop'],
  },
  gold: {
    id: 'gold',
    inventoryKey: 'gold',
    name: 'Gold Coins',
    variant: 'gold',
    action: '',
    amount: 1,
    inventoryActions: ['use'],
  },
  'coins-25': {
    id: 'coins-25',
    inventoryKey: 'gold',
    name: 'Coins',
    variant: 'gold',
    action: 'take',
    amount: 25,
    inventoryActions: ['use'],
  },
  'coins-100': {
    id: 'coins-100',
    inventoryKey: 'gold',
    name: 'Bag of Coins',
    variant: 'gold',
    action: 'take',
    amount: 100,
    inventoryActions: ['use'],
  },
};

export type InventoryDefinition = {
  id: string;
  name: string;
  pluralName: string;
  article: string;
};

export const inventoryDefinitions: { [key: string]: InventoryDefinition } = {
  gold: {
    id: 'gold',
    name: 'Gold',
    pluralName: 'Gold Coins',
    article: 'a',
  },
  'key-silver': {
    id: 'key-silver',
    name: 'Silver Key',
    pluralName: 'Silver Keys',
    article: 'a',
  },
  'key-gold': {
    id: 'key-gold',
    name: 'Gold Key',
    pluralName: 'Gold Keys',
    article: 'a',
  },
};

export const itemOptions: SelectIUIOption[] = [
  { value: 'key-silver', label: 'Silver Key' },
  { value: 'key-gold', label: 'Gold Key' },
  { value: 'coins-25', label: 'Coins' },
  { value: 'coins-100', label: 'Bag of Coins' },
];

const itemKeyOptionsRaw: string[] = [];
Object.keys(itemDefinitions).forEach(key => {
  const itemDef = itemDefinitions[key];
  if (!itemKeyOptionsRaw.includes(itemDef.inventoryKey)) {
    itemKeyOptionsRaw.push(itemDef.inventoryKey);
  }
});

export const itemKeyOptions: SelectIUIOption[] = itemKeyOptionsRaw.map(key => {
  return {
    value: key,
    label: getLabelFromSlug(key),
  };
});
