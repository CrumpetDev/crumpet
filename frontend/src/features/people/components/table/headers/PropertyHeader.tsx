import { Header, flexRender } from '@tanstack/react-table';

interface PropertyHeaderProps<TData, TValue> {
  header: Header<TData, TValue>;
  value: string;
}

const PropertyHeader = <TData, TValue>({ header, value }: PropertyHeaderProps<TData, TValue>) => {
  return (
    <div
      className="th flex justify-between items-center p-2 border-r border-crumpet-light-200 
                        text-grey-700 text-left text-sm font-medium whitespace-nowrap overflow-hidden"
      key={header.id}
      style={{
        width: header.getSize(),
        position: 'relative',
      }}>
        {value}
      {/* {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())} */}
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
  );
};

export default PropertyHeader;
