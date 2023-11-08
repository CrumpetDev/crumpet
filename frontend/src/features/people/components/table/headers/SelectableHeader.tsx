import { Table } from '@tanstack/react-table';
import { IndeterminateCheckbox } from 'components';

const SelectableHeader = <TData extends object | unknown>({ table }: { table: Table<TData> }) => {
  return (
    <div className="flex items-center justify-center p-2 border-r border-crumpet-light-200">
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    </div>
  );
};

export default SelectableHeader;
