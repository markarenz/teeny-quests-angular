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

  ruby: {
    id: 'ruby',
    name: 'Ruby',
    action: 'take',
    inventoryKey: 'ruby',
    amount: 1,
    use: 'fill-gem-frame',
    inventoryActions: ['use', 'drop'],
  },
  diamond: {
    id: 'diamond',
    name: 'Diamond',
    action: 'take',
    inventoryKey: 'diamond',
    amount: 1,
    use: 'fill-gem-frame',
    inventoryActions: ['use', 'drop'],
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald',
    action: 'take',
    inventoryKey: 'emerald',
    amount: 1,
    use: 'fill-gem-frame',
    inventoryActions: ['use', 'drop'],
  },
  sapphire: {
    id: 'sapphire',
    name: 'Sapphire',
    action: 'take',
    inventoryKey: 'sapphire',
    amount: 1,
    use: 'fill-gem-frame',
    inventoryActions: ['use', 'drop'],
  },
};

export type InventoryDefinition = {
  id: string;
  name: string;
  pluralName: string;
  article: string;
  description: string;
  scoreValue: number;
};

export const inventoryDefinitions: { [key: string]: InventoryDefinition } = {
  gold: {
    id: 'gold',
    name: 'Gold',
    pluralName: 'Gold Coins',
    article: 'a',
    description: 'Shiny gold coins that can be used to buy items.',
    scoreValue: 5,
  },
  'key-silver': {
    id: 'key-silver',
    name: 'Silver Key',
    pluralName: 'Silver Keys',
    article: 'a',
    description: 'A key made of silver. It can unlock certain doors.',
    scoreValue: 1,
  },
  'key-gold': {
    id: 'key-gold',
    name: 'Gold Key',
    pluralName: 'Gold Keys',
    article: 'a',
    description: 'A key made of gold. It can unlock certain doors.',
    scoreValue: 10,
  },
  ruby: {
    id: 'ruby',
    name: 'Ruby',
    pluralName: 'Rubies',
    article: 'a',
    description: 'A precious red gemstone.',
    scoreValue: 1000,
  },
  diamond: {
    id: 'diamond',
    name: 'Diamond',
    pluralName: 'Diamonds',
    article: 'a',
    description: 'A valuable clear gemstone.',
    scoreValue: 500,
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald',
    pluralName: 'Emeralds',
    article: 'an',
    description: 'A precious green gemstone.',
    scoreValue: 200,
  },
  sapphire: {
    id: 'sapphire',
    name: 'Sapphire',
    pluralName: 'Sapphires',
    article: 'a',
    description: 'A precious blue gemstone.',
    scoreValue: 100,
  },
};

export const additionalItemOptions: SelectIUIOption[] = Object.values(
  inventoryDefinitions
)
  .filter(def => !['gold', 'coins-25', 'coins-100'].includes(def.id))
  .map(def => ({
    value: def.id,
    label: def.name,
  }));

export const itemOptions: SelectIUIOption[] = [
  { value: 'coins-25', label: 'Coins' },
  { value: 'coins-100', label: 'Bag of Coins' },
  ...additionalItemOptions,
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
