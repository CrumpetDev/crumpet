import { Row } from '@tanstack/react-table';
import { IndeterminateCheckbox } from 'components';

const SelectableHeader = <TData extends object | unknown>({ row }: { row: Row<TData> }) => {
  return (
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
  );
};

export default SelectableHeader;
