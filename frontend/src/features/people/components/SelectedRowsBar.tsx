import { MdDeleteOutline } from 'react-icons/md';
import { usePeopleStore } from '../stores/usePeopleStore';

interface SelectedRowsBarProps {
  selectedCount: number;
}

const SelectedRowsBar = ({ selectedCount }: SelectedRowsBarProps) => {
  const isVisible = selectedCount > 0;
  const visibleClasses = 'opacity-100 translate-y-0'; // Final state: visible
  const hiddenClasses = 'opacity-0 translate-y-1'; // Initial state: invisible

  const deleteSelected = usePeopleStore(state => state.deleteSelectedRows);

  return (
    <div
      className={`flex flex-row transition ease-in-out duration-200 transform bg-white border 
              border-crumpet-light-200 shadow-ultra-light rounded-md divide-x
              divide-crumpet-light-200 cursor-default ${
                isVisible ? visibleClasses : hiddenClasses
              }`}>
      <div className="h-full text-sm font-semibold text-crumpet-yellow-500 p-2">
        {selectedCount} selected
      </div>
      <div
        className="h-full flex flex-row items-center gap-1 text-sm font-medium text-grey-700 p-2
                      hover:bg-crumpet-light-100 hover:cursor-pointer hover:text-red-700"
        onClick={deleteSelected}>
        <MdDeleteOutline className="text-lg" /> Delete
      </div>
    </div>
  );
};

export default SelectedRowsBar;
