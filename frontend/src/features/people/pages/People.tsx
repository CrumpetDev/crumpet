import { ExtendedMainButton, TextButton } from 'components/buttons';
import { SegmentSelector, SelectedRowsBar, Table } from '../components';
import { MdAdd, MdConstruction } from 'react-icons/md';
import { usePeopleStore } from '../stores/usePeopleStore';
import { SoonLabel } from 'components';
import { usePeopleSocket } from '../hooks/usePeopleSocket';
import { useProjectsStore } from 'features/projects/stores/useProjectsStore';
import { isHasData } from 'api/utils';

const People = () => {
  const selectedProject = useProjectsStore(state => state.selectedProject);
  const isActive = isHasData(selectedProject) && !!selectedProject.data.api_key;
  const socketUrl = isActive
    ? `ws://localhost:8001/ws/people/?api_key=${selectedProject.data.api_key}`
    : '';
  usePeopleSocket({ url: socketUrl, isActive });

  const addRow = usePeopleStore(state => state.addRow);
  const selectedRowCount = usePeopleStore(
    state => Object.values(state.rowSelection || {}).filter(value => value).length,
  );
  return (
    <div className="h-full w-full flex flex-row">
      <div className="flex-none w-64 self-stretch flex flex-col p-4 py-8 gap-4 border-r border-crumpet-light-300">
        <h2 className="uppercase text-xs font-semibold text-grey-700">Segments</h2>
        <div className="flex flex-col gap-1">
          <SegmentSelector isSelected={true} />
        </div>
        <div
          className="mt-auto self-stretch flex-none flex flex-row justify-between h-9 pt-3 border-t 
                      border-crumpet-light-200">
          <TextButton label="New segment" icon={<MdAdd />} enabled={false} />
          <SoonLabel />
        </div>
      </div>
      <div className="flex-grow self-stretch flex flex-col px-6 py-8">
        <div className="self-stretch flex flex-row justify-end items-center gap-4 mb-2">
          <SelectedRowsBar selectedCount={selectedRowCount} />
          <div className="bg-crumpet-light-200 h-4 w-0.5" />
          <div className="self-stretch flex flex-row items-center gap-2">
            <SoonLabel className="h-auto" />
            <ExtendedMainButton
              permanentlyDisabled={true}
              icon={<MdConstruction />}
              label="Builder"
              enabled={false}
            />
          </div>
        </div>
        <Table className="self-stretch flex-grow" />
        <div className="self-stretch flex-none flex flex-col h-9 pt-3 border-t border-crumpet-light-200">
          <TextButton label="Add record" icon={<MdAdd />} onClick={addRow} />
        </div>
      </div>
    </div>
  );
};

export default People;
