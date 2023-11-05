import { Popover, Transition } from '@headlessui/react';
import { SlimTextInput } from 'components/inputs';
import { usePeopleStore, PropertyDefinition } from 'features/people/stores/usePeopleStore';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { usePopper } from 'react-popper';
import _ from 'lodash';
import { nanoid } from 'nanoid';

const AddPropertyHeader = () => {
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom',
  });

  const [id] = useState(() => nanoid()); // Initialize with a new GUID
  const [property, setProperty] = useState<Partial<Omit<PropertyDefinition, 'id'>>>({});

  const debounce = useCallback(
    // Delay saving state until user activity stops
    _.debounce((definition: Partial<Omit<PropertyDefinition, 'id'>>) => {
      usePeopleStore.getState().upsertDefinition(id, definition);
      // API Calls go here
      const val = usePeopleStore.getState().propertyDefinitions;
      console.log(val);
    }, 750), // Delay (ms)
    [usePeopleStore.getState().propertyDefinitions],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setProperty(prev => {
        const updatedProperty = { ...prev, [name]: value };
        debounce(updatedProperty);
        return updatedProperty;
      });
    },
    [debounce], // Only recreate this function if debounceSave changes
  );

  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button ref={setReferenceElement} className="flex items-center p-2 outline-none">
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
                className="w-64 overflow-hidden p-4 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                <SlimTextInput
                  label="Display Name"
                  placeholder="Property name"
                  onChange={event => handleChange(event)}
                  inputProps={{ name: 'header' }}
                />
                <SlimTextInput
                  label="Identifier"
                  placeholder="property_name"
                  onChange={event => handleChange(event)}
                  inputProps={{ name: 'accessor' }}
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
