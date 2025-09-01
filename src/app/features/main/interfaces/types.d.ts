import { TableCellDisplayType } from './enums';

export type SelectIUIOption = {
  value: string;
  label: string;
};

export type Link = {
  label: string;
  href?: string;
};
export type SubNavItem = {
  label: string;
  slug: string;
};

export enum EventAction {
  UPDATE_MAP_CELL = 'updateMapCell',

  SET_FLAG = 'setFlag',
  UNSET_FLAG = 'unsetFlag',
  ADD_ITEM = 'addItem',
  REMOVE_ITEM = 'removeItem',
  TELEPORT_PLAYER = 'teleportPlayer',
  CHANGE_AREA = 'changeArea',
}

export type EventEffect = {
  action: EventAction;
  areaId?: string;
  positionKey?: string;
  h?: number;
  floor?: string; // for map cell updates
  wallSouth?: string; // for map cell updates
  wallEast?: string; // for map cell updates
  itemId?: string;
  flagName?: string;
  value?: boolean | number | string;
};

export type GameStatusEffects = {
  [key: string]: EventEffect[];
};

export type GamePanelDeco = {
  id: string;
  panelDecoType: string; // e.g., 'torch', 'painting', 'switch'
  areaId: string;
  x: number;
  y: number;
  h: number;
  wall: string;
  status?: string; // e.g., 'on', 'off', 'activated'
  statusEffects: GameStatusEffects;
};
export type GameAreaMapCell = {
  x: number;
  y: number;
  h: number;
  floor: string;
  wallSouth: string;
  wallEast: string;
};

export type GameItem = {
  id: string;
  itemType: string;
  areaId: string;
  x: number;
  y: number;
  h: number;
  status?: string;
};

export type GameAreaExit = {
  id: string;
  exitType: string;
  areaId: string;
  direction: string;
  x: number;
  y: number;
  h: number;
  destinationAreaId: string;
  destinationExitId: string;
  lock?: string; // e.g., 'gold', 'silver', 'bronze', 'rocks'
};

export type GameAreaMap = {
  [key: string]: GameAreaMapCell;
};

export type GameArea = {
  id: string;
  name: string;
  map: GameAreaMap;
  exits: GameAreaExit[];
  items: GameItem[];
  panels: GamePanelDeco[];
};

export type GameEventCondition = {
  //
};

export type GameEventAction = {
  //
};

export type GameEvent = {
  id: string;
  conditions: GameEventCondition[];
  actions: GameEventAction[];
};

export type Inventory = {
  [key: string]: number;
};

export type GameStateValues = {
  [key: string]: boolean | number | string;
};

export type GameContent = {
  areas: { [key: string]: GameArea };
  events: GameEvent[];
  flagValues: GameStateValues;
  player: {
    areaId: string;
    x: number;
    y: number;
    inventory: Inventory;
  };
};

export type GameROM = {
  id: string;
  title: string;
  description: string;
  introduction: string;
  itemStatus: string;
  userId: string;
  username: string;
  rating?: string;
  content: GameContent;
};

export type StatusEffect = {
  effect: string;
  expirationTurn: number;
};
export type GameStateArea = {
  items: GameItem[];
  exits: GameAreaExit[];
  panels: GamePanelDeco[];
};

export type GameState = {
  gameId: string;
  player: {
    areaId: string;
    x: number;
    y: number;
    inventory: Inventory;
    facing: string;
    health: number;
    statusEffects: StatusEffect[];
  };
  numTurns: number;
  flagValues: GameStateValues;
  areas: {
    [key: string]: GameStateArea;
  };
  firstSaveDate: string;
  lastUpdateDate: string;
};

export type MovementOptions = {
  [key: string]: string[];
};

export type PathfindingGridCell = {
  positionKey: string;
  f: number; // total cost
  g: number; // cost from start to current
  h: number; // heuristic estimation of cost to end
  parent: PathfindingGridCell | null; // parent of the current grid point
};

export type Paragraph = {
  text: string;
  id: number;
};

export type ContentVersionListItem = {
  id: string;
  gameId: string;
  userId: string;
  dateCreated: string;
  dateUpdated: string;
};

export type ContentVersionListItem = {
  id: string;
  gameId: string;
  userId: string;
  dateCreated: string;
  dateUpdated: string;
};

export type ContentVersion = {
  id: string;
  gameId: string;
  userId: string;
  dateCreated: string;
  dateUpdated: string;
  content: string;
};

export type TableAction = {
  label: string;
  onClick: Function;
  theme: string;
  icon: IconButtonIconType;
};

export type TableField = {
  label: string;
  field: string;
  displayType: TableCellDisplayType;
  isLink?: boolean;
  actions?: TableAction[];
};
