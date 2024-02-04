import { Popover, Transition } from '@headlessui/react';
import { Header } from '@tanstack/react-table';
import { TextButton } from 'components/buttons';
import { SlimTextInput } from 'components/inputs';
import { usePeopleStore } from 'features/people/stores/usePeopleStore';
import { Fragment, useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { usePopper } from 'react-popper';

interface PropertyHeaderProps<TData, TValue> {
  header: Header<TData, TValue>;
  value: string;
  propertyKey: string;
}

const PropertyHeader = <TData, TValue>({
  header,
  value,
  propertyKey,
}: PropertyHeaderProps<TData, TValue>) => {
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom',
  });

  const propertyHeader = usePeopleStore(state => state.propertyDefinitions[propertyKey].header);
  const [displayName, setDisplayName] = useState(propertyHeader);

  const upsertDefinition = usePeopleStore(state => state.upsertDefinition);
  const deleteDefinition = usePeopleStore(state => state.deleteDefinition);

  useEffect(() => {
    setDisplayName(propertyHeader);
  }, [propertyHeader]);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        //Delay this so that it comes after the mouseup event on the Popover.Button
        // i.e. so that the Popover.Button doesn't get clicked when dragging
        setTimeout(() => setIsDragging(false), 0);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button
            onClick={event => {
              if (isDragging) {
                event.stopPropagation();
                event.preventDefault();
              }
            }}
            key={header.id}
            ref={setReferenceElement}
            className="th flex justify-between items-center p-2 border-r border-crumpet-light-200
               text-grey-700 text-left text-sm font-medium whitespace-nowrap overflow-hidden 
               hover:bg-crumpet-light-100 hover:cursor-pointer outline-none"
            style={{
              width: header.getSize(),
              position: 'relative',
            }}>
            {value}
            <div
              {...{
                onMouseDown: event => {
                  setIsDragging(true);
                  event.stopPropagation();
                  header.getResizeHandler()(event);
                },
                onTouchStart: event => {
                  event.stopPropagation();
                  header.getResizeHandler()(event);
                },
              }}
              className={`resizer h-full w-1 cursor-col-resize select-none hover:bg-crumpet-yellow-500
                            ${header.column.getIsResizing() ? 'bg-crumpet-yellow-500' : ''} `}
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
              }}
            />
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
                          ring-opacity-5 z-10">
                <SlimTextInput
                  label="Display Name"
                  placeholder="Property name"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  inputProps={{
                    name: 'header',
                    onBlur: () => upsertDefinition(propertyKey, { header: displayName }),
                  }}
                />
                <div className="w-full h-[1px] bg-crumpet-light-200"></div>
                <TextButton
                label="Delete property"
                color="text-red-600 group-hover:text-red-700"
                  icon={<MdDelete />}
                  onClick={() => deleteDefinition(propertyKey) }
                />
              </Popover.Panel>
            </Transition>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};

export default PropertyHeader;
