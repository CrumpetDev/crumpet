import { Popover, Transition } from '@headlessui/react';
import { SlimTextInput } from 'components/inputs';
import { usePeopleStore } from 'features/people/stores/usePeopleStore';
import { Fragment, useCallback, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { usePopper } from 'react-popper';
import { nanoid } from 'nanoid';
import { MainButton } from 'components/buttons';

const AddPropertyHeader = () => {
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom',
  });

  const [id] = useState(() => nanoid()); // Initialize with a new GUID
  const [displayName, setDisplayName] = useState('');
  const [identifier, setIdentifier] = useState('');

  const handleAddColumn = () => {
    usePeopleStore.getState().upsertDefinition(id, { header: displayName, accessor: identifier });
  };

  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button ref={setReferenceElement} className="flex flex-row h-full items-center p-2 outline-none">
            <MdAdd className="text-center text-base text-grey-700" />
          </Popover.Button>
          <Popover.Panel>
            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1">
              <Popover.Panel
                static
                ref={setPopperElement}
                style={styles.popper}
                {...attributes.popper}
                className="flex flex-col w-64 overflow-hidden p-4 gap-2 bg-white rounded-md shadow-lg ring-1 ring-black 
                          ring-opacity-5">
                <SlimTextInput
                  label="Display Name"
                  placeholder="Property name"
                  onChange={e => setDisplayName(e.target.value)}
                  inputProps={{ name: 'header' }}
                />
                <SlimTextInput
                  label="Identifier"
                  placeholder="property_name"
                  onChange={e => setIdentifier(e.target.value)}
                  inputProps={{ name: 'accessor' }}
                />
                <div className="w-full h-[1px] bg-crumpet-light-200"></div>
                <MainButton
                  className="justify-center"
                  label="Add property"
                  icon={<MdAdd />}
                  onClick={handleAddColumn}
                />
              </Popover.Panel>
            </Transition>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};

export default AddPropertyHeader;
