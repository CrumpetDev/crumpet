import { useState, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { MdUnfoldMore, MdOutlineCheck } from 'react-icons/md';

interface Item {
  id: number;
  name: string;
}

interface PickerProps {
  items: Item[];
  initialSelection?: Item;
}

const Picker = ({ items, initialSelection }: PickerProps) => {
  const [selectedItem, setSelectedItem] = useState(
    initialSelection || items[0],
  );

  return (
    <div className="top-16 w-72">
      <Listbox value={selectedItem} onChange={setSelectedItem}>
        <div className="relative mt-1">
          <Listbox.Button
            className="relative w-full cursor-default rounded-lg bg-crumpet-light-200 py-2 pl-3 pr-10 
              text-left font-medium shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 
              focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 
              focus-visible:ring-offset-orange-300 sm:text-sm border border-crumpet-light-300">
            <span className="block truncate">{selectedItem.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <MdUnfoldMore
                className="h-5 w-5 text-oxford"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Listbox.Options
              className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white 
                py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {items.map((item, itemIdx) => (
                <Listbox.Option
                  key={itemIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 
                      ${
                        active ? 'bg-crumpet-bright-100 text-crumpet-bright-500' : 'text-gray-900'
                      }`
                  }
                  value={item}>
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate 
                          ${selected ? 'font-medium' : 'font-normal'}`}>
                        {item.name}
                      </span>
                      {selected ? (
                        <span
                          className="absolute inset-y-0 left-0 flex items-center pl-3 
                            text-red">
                          <MdOutlineCheck
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default Picker;
