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

export type GameAreaExit = {
  id: string;
  exitType: string;
  areaId: string;
  direction: string;
  x: number;
  y: number;
  h: number;
  destinationAreaId: string;
  modifier?: string; // locked
};

export type GameArea = {
  id: string;
  name: string;
  map: { [key: string]: GameAreaMapCell };
  exits: GameAreaExit[];
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

export type GameItem = {
  id: string;
  itemType: string;
  name: string;
  area: string;
  // position: string;
  // ...
};

export type GameContent = {
  areas: { [key: string]: GameArea };
  items: { [key: string]: GameItem };
  events: GameEvent[];
};

export type Game = {
  id: string;
  title: string;
  description: string;
  itemStatus: string;
  userId: string;
  username: string;
  rating?: string;
  content: GameContent;
};

export type GameState = {
  gameId: string;
  playerState: {
    area: string;
    position: string;
    facing: string;
    health: number;
    mapOrientation: string; // north, south, east, west
  };
  flags: { [key: string]: boolean };
  inventory: { [key: string]: number };
  itemsState: { [key: string]: GameItem };
  lastUpdateDate: string;
  lastSaveDate: string;
};
