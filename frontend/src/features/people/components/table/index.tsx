import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { HTMLProps, useEffect, useMemo, useRef, useState } from 'react';
import PropertyHeader from './headers/PropertyHeader';
import { MdAdd } from 'react-icons/md';
import EditableCell from './cells/EditableCell';
import { IndeterminateCheckbox } from 'components';
import AddPropertyHeader from './headers/AddPropertyHeader';

const Table = ({ data, columnJson }: { data: any[]; columnJson: any[] }) => {
  // Convert the structure to column definitions for TanStack Table
  const createColumns = (columnStructure: any[]): ColumnDef<unknown>[] => {
    const columnHelper = createColumnHelper<unknown>();
    const userColumns = columnStructure.map(column => {
      return columnHelper.accessor(column.accessor, {
        header: ({ header }) => <PropertyHeader header={header} value={column.header} />,
        cell: info => <EditableCell cell={info.cell} value={info.getValue()} />,
        size: column.size,
      });
    });
    return [
      {
        id: 'select',
        header: ({ table }) => (
          <div className="flex items-center justify-center p-2 border-r border-crumpet-light-200">
            <IndeterminateCheckbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center p-2 border-r border-crumpet-light-200">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
        size: 48,
        maxSize: 48,
        minSize: 48,
      },
      ...userColumns,
      {
        id: 'add_property',
        header: ({table}) => <AddPropertyHeader />,
        cell: ({ row }) => <div></div>,
      },
    ];
  };

  const columns = useMemo(() => createColumns(columnJson), [columnJson]);
  const [rowSelection, setRowSelection] = useState({});

  const tableInstance = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="relative overflow-x-auto">
      <div className="thead border-b border-t border-crumpet-light-200">
        {tableInstance.getHeaderGroups().map(headerGroup => (
          <div className="tr flex" key={headerGroup.id}>
            {headerGroup.headers.map(header =>
              header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext()),
            )}
          </div>
        ))}
      </div>
      <div className="tbody bg-white">
        {tableInstance.getRowModel().rows.map(row => (
          <div className="tr flex border-b border-crumpet-light-200" key={row.id}>
            {row
              .getVisibleCells()
              .map(cell => flexRender(cell.column.columnDef.cell, cell.getContext()))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
