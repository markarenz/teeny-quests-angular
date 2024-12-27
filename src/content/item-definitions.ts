export type ItemDefinition = {
  id: 'edit';
  name: 'Exit';
  action: 'go';
};

export const itemDefinitions: { [key: string]: ItemDefinition } = {
  exit: {
    id: 'edit',
    name: 'Exit',
    action: 'go',

    // Instance properties:
    // id
    // destination
    // direction
    // locked
    // variant
  },
};
