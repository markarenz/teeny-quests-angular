import { SelectIUIOption } from '@app/features/main/interfaces/types';

export type ActionDefinition = {
  id: string;
  name: string;
  objectType: string;
  valueType: string;
  showAreaId: boolean;
};

export const actionDefinitions: { [key: string]: ActionDefinition } = {
  'map-cell-set-height': {
    id: 'map-cell-set-height',
    name: 'Map Cell: Set Height',
    objectType: 'positionKey',
    showAreaId: true,
    valueType: 'number',
  },
  'map-cell-set-floor': {
    id: 'map-cell-set-floor',
    name: 'Map Cell: Set Floor Type',
    objectType: 'positionKey',
    showAreaId: true,
    valueType: 'floor-id',
  },
};

export const actionOptions: SelectIUIOption[] = Object.values(
  actionDefinitions
).map((def) => ({
  value: def.id,
  label: def.name,
}));
