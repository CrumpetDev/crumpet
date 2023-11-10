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
  data: unknown[];
}

//TODO: Maybe rename to upsertProperty ?

interface Actions {
  upsertDefinition: (id: string, definition: Partial<Omit<PropertyDefinition, 'id'>>) => void;
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  addRow: () => void;
}

function isKeyOfDataObject(
  key: any,
  dataObject: Record<string, any>,
): key is keyof typeof dataObject {
  return key in dataObject;
}

export const usePeopleStore = create<State & Actions>(set => ({
  data: [
    { name: 'Jane Doe', age: 30 },
    { name: 'Jane Doe', age: 32 },
    { name: 'Earl Grey of West Sussex', age: 400000000 },
    // ... more data
  ],
  updateData: (rowIndex: number, columnId: string, value: unknown) =>
    set(
      produce<State>(draft => {
        //const row = draft.data[rowIndex];
        //TODO: Try and get the isKeyOfDataObject to work
        const row = draft.data[rowIndex] as Record<string, any>;
        if (row) {
          row[columnId] = value;
        }
      }),
    ),
  addRow: () =>
    set(
      produce<State>(draft => {
        draft.data.push({});
      }),
    ),
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
