import { Popover, Transition } from '@headlessui/react';
import Picker from 'components/picker';
import SidebarButtonPrimary from './sidebarButtonPrimary';
import SidebarButtonSecondary from './sidebarButtonSecondary';
import {
  MdChevronRight,
  MdSupport,
  MdOutlineOpenInNew,
  MdSettings,
  MdOutlineBadge,
  MdCheck,
  MdAdd,
} from 'react-icons/md';
import { ReactComponent as Flow } from 'assets/icons/Flow Icon.svg';
import { ReactComponent as CrumpetLogo } from 'assets/images/Crumpet Logo Oxford.svg';
import { Fragment, useState } from 'react';
import { CreateProjectModal } from 'features/projects/components/CreateProjectModal';
import { useProjectsStore } from 'features/projects/stores/useProjectsStore';
import { getFirstLetter } from 'utils';
import { TextButton } from 'components/buttons';
import { useNavigate } from 'react-router';
import { isHasData } from 'api/utils';
import { usePopper } from 'react-popper';

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
  const [isOpen, setIsOpen] = useState(false);
  const { selectedProject, setSelectedProject } = useProjectsStore();
  const isLoadingState = ['initial', 'loading', 'hasError'].includes(selectedProject.state);
  const navigate = useNavigate();

  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top',
  });

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  // icon property is a function to allow for styling
  const ButtonList = [
    {
      label: 'Flows',
      icon: () => <Flow style={{ height: '16px', width: '16px' }} />,
      onClick: () => {
        navigate("/flows");
      },
      selected: true,
    },
    {
      label: 'People',
      icon: () => <MdOutlineBadge />,
      onClick: () => {
        navigate("/people");
      },
    },
  ];

  return (
    <>
      <div
        className="w-72 h-screen pt-4 bg-crumpet-light-100 border-r border-crumpet-light-300 flex-col 
                justify-between items-center gap-8 flex">
        <div className="self-stretch px-4 py-3 flex-col justify-start gap-8 flex">
          <div className="flex items-center gap-2">
            <CrumpetLogo style={{ height: '24px', width: '24px' }} />
            <div className="text-oxford font-heebo font-black text-2xl">Crumpet</div>
          </div>
          {isHasData(selectedProject) && selectedProject.data.environments != undefined && (
            <Picker
              widthFill={true}
              items={selectedProject.data.environments}
              initialSelection={selectedProject.data.environments[0]}
            />
          )}
          <div className="flex-col justify-start items-start gap-0.5 flex w-full">
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
          <div className="self-stretch flex flex-col gap-0.5 px-4 ">
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
                  ref={setReferenceElement}
                  disabled={isLoadingState}
                  className="w-full flex justify-between items-center p-4 border-t 
																				border-crumpet-light-300">
                  {isLoadingState ? (
                    // Render pulsing grey rectangle for initial, loading, and hasError states
                    <div className="flex items-center space-x-4 animate-pulse">
                      <div className="w-8 h-8 rounded bg-crumpet-light-300"></div>
                      <div className="w-32 h-6 rounded bg-crumpet-light-300"></div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded bg-blue-400 text-white flex items-center justify-center">
                        {getFirstLetter(
                          isHasData(selectedProject) ? selectedProject.data.name : null,
                        )}
                      </div>
                      <span className="text-base font-semibold">
                        {isHasData(selectedProject) ? selectedProject.data.name : ''}
                      </span>
                    </div>
                  )}
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
                    ref={setPopperElement}
                    style={styles.popper}
                    {...attributes.popper}
                    className="w-full px-2">
                    <div className="overflow-hidden rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="flex flex-col gap-4 relative p-4 bg-white">
                        {projects.map((project, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedProject(project.id)}
                            className="flex flex-row justify-between items-center">
                            <div className="flex flex-row gap-2 w-full">
                              <div
                                className="w-8 h-8 rounded bg-blue-400 text-white
																					flex items-center justify-center">
                                {getFirstLetter(project.name)}
                              </div>
                              <div className="flex flex-col">
                                <p className="text-sm font-medium text-oxford text-left">
                                  {project.name}
                                </p>
                                <p className="text-xs text-grey-700 text-left">1 member</p>
                              </div>
                            </div>
                            {isHasData(selectedProject) && project.id == selectedProject.data.id ? (
                              <MdCheck className="text-grey-900" />
                            ) : (
                              <></>
                            )}
                          </button>
                        ))}
                        <div className="w-full h-[1px] bg-crumpet-light-200"></div>
                        <TextButton
                          label="Project settings"
                          icon={<MdSettings />}
                          onClick={() => navigate('/settings')}
                        />
                        <TextButton label="New project" icon={<MdAdd />} onClick={openModal} />
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        </div>
      </div>
      <CreateProjectModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
};

export default SidebarMenu;
