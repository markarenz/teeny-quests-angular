export enum TableCellDisplayType {
  String = 'string',
  Date = 'date',
  Number = 'number',
  Boolean = 'boolean',
  StatusChip = 'status-chip',
  Actions = 'actions',
}

export enum IconButtonIconType {
  New = 'new',
  Delete = 'delete',
  Check = 'check',
  Info = 'info',
  Help = 'help',
  Backpack = 'back',
  Drop = 'drop',
  Use = 'use',
}

export enum EventAction {
  UPDATE_MAP_CELL_HEIGHT = 'update-map-cell-height',
  UPDATE_MAP_CELL_FLOOR = 'update-map-cell-floor',
  SET_PROP_STATUS = 'set-prop-status',
  SET_FLAG = 'set-flag',
  ADD_ITEM = 'add-item',
  REMOVE_ITEM = 'remove-item',
  TELEPORT_PLAYER = 'teleport-player',
}

export enum ActionObjectType {
  MAP_CELL = 'map-cell',
  ITEM_ID = 'item-id',
  EXIT_ID = 'exit-id',
  PROP_ID = 'prop-id',
  FLAG_ID = 'flag-id',
}

export enum ActionValueType {
  CELL_HEIGHT = 'cell-height',
  FLOOR_TYPE = 'floor-type',
  PROP_STATUS = 'prop-status',
  BOOLEAN = 'boolean',
}

export enum EventConditionType {
  FLAG = 'flag',
  INVENTORY = 'inventory',
}

export enum ConditionComparison {
  EQUALS = 'equals',
  NOT_EQUALS = 'not-equals',
  GREATER_THAN = 'greater-than',
  GREATER_THAN_OR_EQUALS = 'greater-than-or-equals',
  LESS_THAN = 'less-than',
  LESS_THAN_OR_EQUALS = 'less-than-or-equals',
}

export enum ConditionObjectType {
  INVENTORY_KEY = 'inventory-key',
  FLAG_ID = 'flag-id',
}

export enum ConditionValueType {
  NUMBER = 'number',
  BOOLEAN = 'boolean',
}
