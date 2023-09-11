import { Popover, Transition } from '@headlessui/react';
import Picker from 'components/picker';
import CustomButton from 'components/button';
import SidebarButtonPrimary from './sidebarButtonPrimary';
import SidebarButtonSecondary from './sidebarButtonSecondary';
import {
  MdSpoke,
  MdChevronRight,
  MdSupport,
  MdOutlineOpenInNew,
  MdSettings,
  MdOutlineBadge,
  MdCheck,
} from 'react-icons/md';
import { ReactComponent as Flow } from 'assets/icons/Flow Icon.svg';
import { ReactComponent as CrumpetLogo } from 'assets/images/Crumpet Logo Oxford.svg';
import { Fragment } from 'react';

const environments = [
  { id: 1, name: 'Development' },
  { id: 2, name: 'Production' },
];

interface ProjectEntry {
  id: number;
  name: string;
  selected: boolean;
  onSettingsClick?: (project: ProjectEntry) => void;
}

interface SidebarMenuProps {
  projects: ProjectEntry[];
}

const SidebarMenu = ({ projects }: SidebarMenuProps) => {
  // icon property is a function to allow for styling
  const ButtonList = [
    {
      label: 'Flows',
      icon: () => <Flow style={{ height: '16px', width: '16px' }} />,
      onClick: () => {
        console.log('Clicked Button');
      },
      selected: true,
    },
    {
      label: 'Customers',
      icon: () => <MdOutlineBadge />,
      onClick: () => {
        console.log('Clicked Button');
      },
    },
    {
      label: 'Segments',
      icon: () => <MdSpoke />,
      onClick: () => {
        console.log('Clicked Button');
      },
    },
  ];

  return (
    <>
      <div
        className="w-64 h-screen pt-4 bg-crumpet-light-100 border-r border-crumpet-light-300 flex-col 
                justify-between items-center gap-8 flex">
        <div className="self-stretch px-4 py-3 flex-col justify-start gap-8 flex">
          <div className="flex items-center gap-2">
            <CrumpetLogo style={{ height: '24px', width: '24px' }} />
            <div className="text-oxford font-heebo font-black text-2xl">Crumpet</div>
          </div>
          <Picker widthFill={true} items={environments} initialSelection={environments[0]} />
          <div className="flex-col justify-start items-start gap-4 flex w-full">
            {ButtonList.map((button, index) => (
              <SidebarButtonPrimary
                key={index}
                icon={button.icon()}
                label={button.label}
                onClick={button.onClick}
                widthFill={true}
                selected={button.selected}
              />
            ))}
          </div>
        </div>
        <div className="self-stretch flex-col justify-end items-center gap-4 flex">
          <div className="self-stretch flex flex-col gap-4 px-4 ">
            <SidebarButtonSecondary
              icon={<MdSupport />}
              label="Support"
              onClick={() => console.log('clicked')}
              widthFill={true}
              secondaryIcon={<MdOutlineOpenInNew />}
            />
            <SidebarButtonSecondary
              icon={<MdSettings />}
              label="Settings"
              onClick={() => console.log('clicked')}
              widthFill={true}
            />
          </div>
          <Popover className="relative w-full">
            {({ open }) => (
              <>
                <Popover.Button
                  className="w-full flex justify-between items-center p-4 border-t 
																				border-crumpet-light-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center">
                      C
                    </div>
                    <span className="text-base font-semibold">Crumpet</span>
                  </div>
                  <MdChevronRight className="fill-gray-500" />
                </Popover.Button>
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
                    className="absolute z-10 max-w-sm px-0 transform translate-x-full bottom-4">
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="flex flex-col gap-1 relative px-4 py-3 bg-white">
                        {projects.map((project, index) => (
                          <div
                            className={`flex flex-row justify-between items-center py-1 px-2 gap-2 rounded ${
                              project.selected ? 'bg-crumpet-light-100' : 'bg-white'
                            }`}
                            key={index}>
                            <MdSettings
                              onClick={() => project.onSettingsClick?.call(null, project)}
                            />
                            <span className="grow"> {project.name} </span>
                            {project.selected ? <MdCheck /> : <></>}
                          </div>
                        ))}
                        <CustomButton
                          text="Add New"
                          onClick={() => {
                            console.log('clicked');
                          }}
                        />
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        </div>
      </div>
    </>
  );
};

export default SidebarMenu;
