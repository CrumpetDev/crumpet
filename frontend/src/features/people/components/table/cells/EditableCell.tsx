import { Cell, Column, Table, RowData, Row } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

interface EditableCellProps<TData, TValue> {
  cell: Cell<TData, TValue>;
  value: unknown;
  column: Column<TData>;
  table: Table<TData>;
  row: Row<TData>;
}

const EditableCell = <TData, TValue>({
  cell,
  value: initialValue,
  column,
  table,
  row,
}: EditableCellProps<TData, TValue>) => {
  const [value, setValue] = useState<string>(initialValue as string);

  useEffect(() => {
    setValue(initialValue as string);
  }, [initialValue]);

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };

  return (
    <div
      className="td p-2 border-r border-crumpet-light-200 focus-within:outline-2 
      focus-within:outline focus-within:outline-crumpet-yellow-500 
      focus-within:rounded-md"
      style={{
        width: cell.column.getSize(),
      }}>
      <input
        className="w-full h-full outline-none text-oxford 
                text-sm whitespace-nowrap overflow-hidden"
        key={cell.id}
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={onBlur}
      />
    </div>
  );
};

export default EditableCell;
