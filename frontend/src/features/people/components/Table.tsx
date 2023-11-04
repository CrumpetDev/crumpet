import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';

const Table = ({ data, columnJson }: { data: any[]; columnJson: any[] }) => {
  // Convert the structure to column definitions for TanStack Table
  const createColumns = (columnStructure: any[]): ColumnDef<unknown>[] => {
    const columnHelper = createColumnHelper<unknown>();
    return columnStructure.map(column => {
      return columnHelper.accessor(column.accessor, {
        header: () => column.header,
        cell: info => info.getValue(),
        size: column.size,
      });
    });
  };

  const columns = useMemo(() => createColumns(columnJson), [columnJson]);

  const tableInstance = useReactTable({
    data,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="relative overflow-x-auto">
      <div className="thead border-b border-t border-crumpet-light-200">
        {tableInstance.getHeaderGroups().map(headerGroup => (
          <div className="tr flex" key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <div
                className="th flex justify-between items-center p-2 border-r border-crumpet-light-200 
                        text-grey-700 text-left text-sm font-medium whitespace-nowrap overflow-hidden"
                key={header.id}
                style={{
                  width: header.getSize(),
                  position: 'relative',
                }}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
                <div
                  {...{
                    onMouseDown: header.getResizeHandler(),
                    onTouchStart: header.getResizeHandler(),
                  }}
                  className={`resizer h-full w-1 cursor-col-resize select-none hover:bg-crumpet-yellow-500
                            ${header.column.getIsResizing() ? 'bg-crumpet-yellow-500' : ''} `}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="tbody bg-white">
        {tableInstance.getRowModel().rows.map(row => (
          <div className="tr flex border-b border-crumpet-light-200" key={row.id}>
            {row.getVisibleCells().map(cell => (
              <div
                className="td p-2 border-r border-crumpet-light-200  text-oxford 
                          text-sm whitespace-nowrap overflow-hidden"
                key={cell.id}
                style={{
                  width: cell.column.getSize(),
                }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
