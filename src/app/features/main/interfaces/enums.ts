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
  SET_FLAG = 'setFlag',
  UNSET_FLAG = 'unsetFlag',
  ADD_ITEM = 'addItem',
  REMOVE_ITEM = 'removeItem',
  TELEPORT_PLAYER = 'teleportPlayer',
  CHANGE_AREA = 'changeArea',
}

export enum ActionObjectType {
  MAP_CELL = 'map-cell',
  ITEM = 'item',
  EXIT = 'exit',
  PANEL_DECO = 'panel-deco',
  FLAG = 'flag',
}
export enum ActionValueType {
  NUMBER = 'number',
  STRING = 'string',
  BOOLEAN = 'boolean',
}
