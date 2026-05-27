import { SelectIUIOption } from '@app/features/main/interfaces/types';
import { getLabelFromSlug } from '@app/features/main/utils';

export type ItemDefinition = {
  id: string;
  inventoryKey: string;
  name: string;
  variant?: string;
  action?: string; // on click in area
  use?: string; // action from Inventory
  useDescription?: string; // description of use action for UI
  amount?: number;
  defenseBuff?: number; // for use with armor items
  inventoryActions: string[]; // actions available in inventory
};

export type ItemWeaponDefinition = ItemDefinition & {
  weaponConsumable: boolean;
  accuracy: number;
  minDamage: number;
  maxDamage: number;
  weaponSoundId: string;
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
  pointyStick: {
    id: 'pointyStick',
    name: 'Pointy Stick',
    action: 'take',
    inventoryKey: 'pointyStick',
    amount: 1,
    use: '',
    inventoryActions: ['drop'],
  },
  adequateBlade: {
    id: 'adequateBlade',
    name: 'Adequate Blade',
    action: 'take',
    inventoryKey: 'adequateBlade',
    amount: 1,
    use: '',
    inventoryActions: ['drop'],
  },
  awesomeSword: {
    id: 'awesomeSword',
    name: 'Sword of Awesomeness',
    action: 'take',
    inventoryKey: 'awesomeSword',
    amount: 1,
    use: '',
    inventoryActions: ['drop'],
  },
  ringProtection: {
    id: 'ringProtection',
    name: 'Ring of Protection',
    action: 'take',
    inventoryKey: 'ringProtection',
    amount: 1,
    use: '',
    inventoryActions: ['drop'],
    defenseBuff: 0.2,
  },
  healthCookie: {
    id: 'healthCookie',
    name: 'Cookie',
    action: 'take',
    inventoryKey: 'healthCookie',
    amount: 1,
    use: 'health-sm',
    useDescription: 'The cookie is delicious. You feel healthier.',
    inventoryActions: ['use', 'drop'],
  },
  healthPotion: {
    id: 'healthPotion',
    name: 'Health Potion',
    action: 'take',
    inventoryKey: 'healthPotion',
    amount: 1,
    use: 'health-lg',
    useDescription:
      "The potion in the pestle holds the brew that's true. You feel much healthier.",
    inventoryActions: ['use', 'drop'],
  },
  healthContainer: {
    id: 'healthContainer',
    name: 'Heart',
    action: 'take',
    inventoryKey: 'healthContainer',
    amount: 1,
    use: 'heart',
    inventoryActions: ['use', 'drop'],
  },
};

export const itemWeaponDefinitions: { [key: string]: ItemWeaponDefinition } = {
  bareHands: {
    id: 'bareHands',
    name: 'Bare Hands',
    action: 'take',
    inventoryKey: 'bareHands',
    amount: 1,
    use: '',
    inventoryActions: [],
    weaponConsumable: false,
    accuracy: 0.2,
    minDamage: 0.25,
    maxDamage: 0.25,
    weaponSoundId: 'attack-slash',
  },
  pointyStick: {
    ...itemDefinitions['pointyStick'],
    weaponConsumable: false,
    accuracy: 0.3,
    minDamage: 0.5,
    maxDamage: 1,
    weaponSoundId: 'attack-slash',
  },
  adequateBlade: {
    ...itemDefinitions['adequateBlade'],
    weaponConsumable: false,
    accuracy: 0.4,
    minDamage: 1,
    maxDamage: 2,
    weaponSoundId: 'attack-slash',
  },
  awesomeSword: {
    ...itemDefinitions['awesomeSword'],
    weaponConsumable: false,
    accuracy: 0.5,
    minDamage: 2,
    maxDamage: 4,
    weaponSoundId: 'attack-slash',
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
  pointyStick: {
    id: 'pointyStick',
    name: 'Pointy Stick',
    pluralName: 'Pointy Sticks',
    article: 'a',
    description:
      'A stick that is pointy on one end. It can do minor damage in combat.',
    scoreValue: 10,
  },
  adequateBlade: {
    id: 'adequateBlade',
    name: 'Adequate Blade',
    pluralName: 'Adequate Blades',
    article: 'an',
    description: "An OK blade that does medium damage. It's fine, really.",
    scoreValue: 20,
  },
  awesomeSword: {
    id: 'awesomeSword',
    name: 'Awesome Sword',
    pluralName: 'Awesome Swords',
    article: 'an',
    description:
      "An awesome sword that does high damage. Ooh, it's so pretty and impressive!",
    scoreValue: 20,
  },
  ringProtection: {
    id: 'ringProtection',
    name: 'Ring of Protection',
    pluralName: 'Rings of Protection',
    article: 'a',
    description:
      'A fashionable ring of protection. Just having it in your inventory makes you feel harder to hit.',
    scoreValue: 500,
  },
  healthCookie: {
    id: 'healthCookie',
    name: 'Cookie',
    pluralName: 'Cookies',
    article: 'a',
    description: 'A cookie that restores a small amount of health when used.',
    scoreValue: 25,
  },
  healthPotion: {
    id: 'healthPotion',
    name: 'Health Potion',
    pluralName: 'Health Potions',
    article: 'a',
    description: 'A potion that restores a large amount of health when used.',
    scoreValue: 75,
  },
  healthContainer: {
    id: 'healthContainer',
    name: 'Heart',
    pluralName: 'Hearts',
    article: 'a',
    description:
      'A heart container that increases your maximum health when used, limited to 8.',
    scoreValue: 150,
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
