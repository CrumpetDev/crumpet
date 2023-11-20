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
  setupSocket: (url: string) => void;
  destroy: () => void;
}

export const usePeopleStore = create<State & Actions>()(
  subscribeWithSelector((set, get) => {
    return {
      setupSocket: url => {
        setupSocket(set, url);
      },
      destroy: () => {
        if (socket) {
          socket.close();
        }
      },
      data: [
        { name: 'Jane Doe', age: 30 },
        { name: 'Jane Doe', age: 32 },
        { name: 'Earl Grey of West Sussex', age: 400000000 },
        // ... more data
      ],
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        // Update store
        set(
          produce<State>(draft => {
            const row = draft.data[rowIndex] as Record<string, any>;
            if (row) {
              row[columnId] = value;
            }
          }),
        );
        // Send message over socket
        socket?.send(JSON.stringify({ message: 'testing' }));
      },
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
    };
  }),
);

let socket: WebSocket | null = null;

const setupSocket = (set: any, url?: string | null) => {
  if (socket) {
    console.log('closing inside initializeSocket');
    socket.close();
  }
  if (url == null) return;

  console.log('settings up socket');

  socket = new WebSocket(url);

  socket.onopen = () => {
    /* handle open */
    if (socket == null) return;
    console.log('Sending message');
    socket.send(JSON.stringify({ message: 'testing' }));
  };
  socket.onmessage = e => {
    /* handle incoming messages */
    const wsData = JSON.parse(e.data);
    console.log(wsData);
  };
  socket.onerror = error => {
    /* handle error */
  };
  socket.onclose = () => {
    /* handle close */
  };
};