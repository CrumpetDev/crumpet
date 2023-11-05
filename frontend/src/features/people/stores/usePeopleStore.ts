import { create } from 'zustand';

export interface PropertyDefinition {
  id: string;
  accessor?: string;
  header?: string;
  type?: string;
}

interface State {
  propertyDefinitions: Record<string, PropertyDefinition>;
}

//TODO: Maybe rename to upsertProperty ?
interface Actions {
  upsertDefinition: (id: string, definition: Partial<Omit<PropertyDefinition, 'id'>>) => void;
}

export const usePeopleStore = create<State & Actions>(set => ({
  propertyDefinitions: {},
  upsertDefinition: (id, definition) =>
    set(state => ({
      propertyDefinitions: {
        ...state.propertyDefinitions,
        [id]: { ...definition, id }, // Merge with the existing data
      },
    })),
}));
