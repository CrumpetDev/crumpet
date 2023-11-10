import { TextButton } from 'components/buttons';
import { Table } from '../components';
import { MdAdd } from 'react-icons/md';
import { usePeopleStore } from '../stores/usePeopleStore';

const People = () => {
  const addRow = usePeopleStore(state => state.addRow);
  return (
    <div className="w-full h-full flex flex-col px-6 py-8">
      <Table className="w-full flex-grow" />
      <div className="w-full flex-none flex flex-col pt-3 border-t border-crumpet-light-200">
        <TextButton label="Add record" icon={<MdAdd />} onClick={addRow} />
      </div>
    </div>
  );
};

export default People;
