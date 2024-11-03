import { TableCellDisplayType } from './enums';

export type Link = {
  label: string;
  href?: string;
};

export type FieldLabel = {
  label: string;
  field: string;
  displayType: TableCellDisplayType;
};
