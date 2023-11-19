import { RowSelectionState } from '@tanstack/react-table';
import { produce } from 'immer';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface PropertyDefinition {
  id: string;
  accessor: string;
  header: string;
  type?: string;
}

interface State {
  propertyDefinitions: Record<string, Omit<PropertyDefinition, 'id'>>;
  data: unknown[];
  rowSelection: RowSelectionState | undefined;
}

//TODO: Maybe rename to upsertProperty ?

interface Actions {
  upsertDefinition: (id: string, definition: Partial<Omit<PropertyDefinition, 'id'>>) => void;
  deleteDefinition: (id: string) => void;
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  addRow: () => void;
  setRowSelection: (newRowSelection: RowSelectionState) => void;
  deleteSelectedRows: () => void;
}

export const usePeopleStore = create<State & Actions>()(
  subscribeWithSelector(set => ({
    data: [
      { name: 'Jane Doe', age: 30 },
      { name: 'Jane Doe', age: 32 },
      { name: 'Earl Grey of West Sussex', age: 400000000 },
      // ... more data
    ],
    updateData: (rowIndex: number, columnId: string, value: unknown) =>
      set(
        produce<State>(draft => {
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
    rowSelection: {},
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
    deleteDefinition: (
      id, // Implement the delete function
    ) =>
      set(
        produce<State>(draft => {
          delete draft.propertyDefinitions[id];
        }),
      ),
    setRowSelection: newRowSelection =>
      set(
        produce<State>(draft => {
          draft.rowSelection = newRowSelection;
        }),
      ),
    deleteSelectedRows: () =>
      set(
        produce<State>(draft => {
          if (draft.rowSelection) {
            // Filter out the rows that are selected
            draft.data = draft.data.filter((_, index) => !draft.rowSelection?.[index]);
            // Reset the rowSelection state after deletion
            draft.rowSelection = {};
          }
        }),
      ),
  })),
);
