import { TextButton } from 'components/buttons';
import { SegmentSelector, Table } from '../components';
import { MdAdd } from 'react-icons/md';
import { usePeopleStore } from '../stores/usePeopleStore';
import { SoonLabel } from 'components';

const People = () => {
  const addRow = usePeopleStore(state => state.addRow);
  return (
    <div className="w-full h-full flex flex-row">
      <div className="flex-none w-64 self-stretch flex flex-col p-4 py-8 gap-4 border-r border-crumpet-light-300">
        <h2 className="uppercase text-xs font-semibold text-grey-700">Segments</h2>
        <div className="flex flex-col gap-1">
          <SegmentSelector isSelected={true} />
        </div>
        <div className="mt-auto self-stretch flex-none flex flex-row justify-between h-9 pt-3 border-t 
                      border-crumpet-light-200">
          <TextButton label="New segment" icon={<MdAdd />} enabled={false} />
          <SoonLabel />
        </div>
      </div>
      <div className="flex-grow self-stretch flex flex-col px-6 py-8">
        <Table className="self-stretch flex-grow" />
        <div className="self-stretch flex-none flex flex-col h-9 pt-3 border-t border-crumpet-light-200">
          <TextButton label="Add record" icon={<MdAdd />} onClick={addRow} />
        </div>
      </div>
    </div>
  );
};

export default People;
