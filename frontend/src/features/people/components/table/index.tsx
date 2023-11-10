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
import { usePeopleStore } from 'features/people/stores/usePeopleStore';
import SelectableHeader from './headers/SelectableHeader';
import SelectableCell from './cells/SelectableCell';

interface TableProps {
  data: any[];
  columnJson: any[];
  className?: string;
}

const Table = ({ data, columnJson, className }: TableProps) => {
  const propertyDefs = usePeopleStore(state => state.propertyDefinitions);

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<unknown>();

    const cols = Object.entries(propertyDefs).map(([key, value]) => {
      return columnHelper.accessor(value.accessor, {
        header: ({ header }) => <PropertyHeader header={header} value={value.header} />,
        cell: info => (
          <EditableCell
            column={info.column}
            table={info.table}
            row={info.row}
            cell={info.cell}
            value={info.getValue()}
          />
        ),
        size: 180,
      });
    });

    return [
      {
        id: 'select',
        header: ({ table }) => <SelectableHeader table={table} />,
        cell: ({ row }) => <SelectableCell row={row} />,
        size: 48,
        maxSize: 48,
        minSize: 48,
      },
      ...cols,
      {
        id: 'add_property',
        header: ({ table }) => <AddPropertyHeader />,
        cell: ({ row }) => <div></div>,
      },
    ] as ColumnDef<unknown>[];
  }, [propertyDefs]);

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
    <div className={`relative overflow-x-auto ${className}`}>
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
