import { Action } from 'rxjs/internal/scheduler/Action';
import {
  TableCellDisplayType,
  EventAction,
  ActionObjectType,
  ActionValueType,
  ConditionComparison,
  ActorStatus,
} from './enums';

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

export type QuestEventActionCondition = {
  id: string;
  conditionType: EventConditionType;
  identifier: string; // based on cidition type: inventory-key, flagId-select, itemId-select,
  subIdentifier?: string; // for map cell conditions, e.g., 'floor', 'wallSouth', 'wallEast'
  comparison: ConditionComparison;
  value: boolean | number | string;
};

export type ActionEffect = {
  id: string;
  action: EventAction;
  actionObject: {
    areaId?: string;
    identifier?: string; // itemId, exitId, panelDecoId, positionKey, flagId, etc.
    subIdentifier?: string; // for map cell updates, e.g., 'floor', 'wallSouth', 'wallEast'
  };
  actionValue: boolean | number | string;
};

export type QuestActionEffects = {
  [key: string]: ActionEffect[];
};

export type QuestProp = {
  id: string;
  name?: string;
  propType: string; // e.g., 'torch', 'painting', 'switch'
  areaId: string;
  x: number;
  y: number;
  h: number;
  wall: string;
  status?: string; // e.g., 'on', 'off', 'activated'
  statusActions: QuestActionEffects;
};

export type QuestAreaMapCell = {
  x: number;
  y: number;
  h: number;
  floor: string;
  wallSouth: string;
  wallEast: string;
  isHidden?: boolean;
  decal?: string;
};

export type QuestItem = {
  id: string;
  name?: string;
  itemType: string;
  areaId: string;
  x: number;
  y: number;
  h: number;
  status?: string;
};

export type QuestAreaExit = {
  id: string;
  name?: string;
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

export type QuestActor = {
  id: string;
  name?: string;
  actorType: ActorType;
  actorStatus: ActorStatus;
  health: number;
  areaId: string;
  x: number;
  y: number;
  h: number;
  actions: ActionEffect[];
};

export type QuestAreaMap = {
  [key: string]: QuestAreaMapCell;
};

export type QuestArea = {
  id: string;
  name: string;
  map: QuestAreaMap;
  exits: QuestAreaExit[];
  items: QuestItem[];
  props: QuestProp[];
  actors: QuestActor[];
};

export type QuestEvent = {
  id: string;
  name: string;
  isUnidirectional: boolean; // if true, event can only trigger once
  conditions: QuestEventActionCondition[];
  actions: ActionEffect[];
};

export type Inventory = {
  [key: string]: number;
};

export type QuestStateValues = {
  [key: string]: boolean | number | string;
};

export type QuestFlag = {
  id: string;
  name: string;
  scoreValue: number;
};

export type QuestContent = {
  areas: { [key: string]: QuestArea };
  events: QuestEvent[];
  flags?: QuestFlag[];
  flagValues: QuestStateValues;
  player: {
    areaId: string;
    x: number;
    y: number;
    inventory: Inventory;
  };
};

export type QuestROM = {
  id: string;
  title: string;
  description: string;
  introduction?: string;
  itemStatus: string;
  userId: string;
  username: string;
  rating?: string;
  content: QuestContent;
  playCount?: number;
  completionCount?: number;
};

export type StatusEffect = {
  effect: string;
  expirationTurn: number;
};

export type QuestStateArea = {
  map: QuestAreaMap;
  items: QuestItem[];
  exits: QuestAreaExit[];
  props: QuestProp[];
  actors: QuestActor[];
};

export type QuestState = {
  gameId: string;
  player: {
    areaId: string;
    x: number;
    y: number;
    inventory: Inventory;
    facing: string;
    health: number;
    maxHealth?: number;
    defense?: number;
    accuracy?: number;
    damage?: number;
    statusActions: StatusEffect[];
  };
  numTurns: number;
  flagValues: QuestStateValues;
  areas: {
    [key: string]: QuestStateArea;
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

export type ToastMessage = {
  title: string;
  message: string;
  messageType?: 'info' | 'success' | 'error' | 'warning';
  sound?: string;
};

export type PropDefinition = {
  id: string;
  name: string;
  canSetHeight: boolean;
  hasStatusEffects: boolean;
  isClickable: boolean;
  statuses?: string[];
  ambientLight?: number; // 0.0 - 1.0
  lightPattern?: string;
  sound?: string;
  statusMessages?: {
    [status: string]: ToastMessage;
  };
};

export type ActionTypeDefinition = {
  requiresAreaId: boolean;
  objectType: ActionObjectType;
  valueType: ActionValueType;
  numMin?: number;
  numMax?: number;
};

export type LightMap = {
  [key: string]: number; // positionKey to light level (0.0 - 1.0)
};

export type LightCell = {
  dx: number;
  dy: number;
  lightAdd: number;
};

export type WallTextureProps = {
  wallType: string;
  svgViewBox: string;
  wallPosition: string;
  wallTexture: string;
  textureId: string;
  svgPolygonPoints: string[];
  h: number;
};
