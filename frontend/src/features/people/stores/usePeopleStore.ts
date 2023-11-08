import { produce } from 'immer';
import { create } from 'zustand';

export interface PropertyDefinition {
  id: string;
  accessor: string;
  header: string;
  type?: string;
}

interface State {
  propertyDefinitions: Record<string, Omit<PropertyDefinition, 'id'>>;
}

//TODO: Maybe rename to upsertProperty ?
interface Actions {
  upsertDefinition: (id: string, definition: Partial<Omit<PropertyDefinition, 'id'>>) => void;
}

export const usePeopleStore = create<State & Actions>(set => ({
  propertyDefinitions: {
    id_1: { accessor: 'name', header: 'Name' },
    id_2: { accessor: 'age', header: 'Age' },
  },
  upsertDefinition: (id, newDefinition) =>
    set(
      produce<State>(draft => {
        if (draft.propertyDefinitions[id]) {
          // If the definition exists, merge it
          Object.assign(draft.propertyDefinitions[id], newDefinition);
        } else {
          // If the definition does not exist, create a new one
          // (you should validate the full object structure here)
          draft.propertyDefinitions[id] = newDefinition as Omit<PropertyDefinition, 'id'>;
        }
      }),
    ),
}));
