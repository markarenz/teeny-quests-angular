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

export type FieldLabel = {
  label: string;
  field: string;
  displayType: TableCellDisplayType;
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
  status?: string; // locked
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
  // FUTURE: NPCs, etc
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
