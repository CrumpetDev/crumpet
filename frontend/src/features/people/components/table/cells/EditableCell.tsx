import { Cell } from '@tanstack/react-table';
import { ReactNode } from 'react';

interface EditableCellProps<TData, TValue> {
  cell: Cell<TData, TValue>;
  value: unknown;
}

const EditableCell = <TData, TValue>({ cell, value }: EditableCellProps<TData, TValue>) => {
  return (
    <div
      className="td p-2 border-r border-crumpet-light-200  text-oxford 
                          text-sm whitespace-nowrap overflow-hidden"
      key={cell.id}
      style={{
        width: cell.column.getSize(),
      }}>
      {value as ReactNode}
    </div>
  );
};

export default EditableCell;
