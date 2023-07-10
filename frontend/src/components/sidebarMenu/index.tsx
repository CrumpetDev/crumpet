import Picker from 'components/picker';
import SidebarButtonPrimary from './sidebarButtonPrimary';
import SidebarButtonSecondary from './sidebarButtonSecondary';
import {
  MdSpoke,
  MdChevronRight,
  MdSupport,
  MdOutlineOpenInNew,
  MdSettings,
  MdOutlineBadge,
} from 'react-icons/md';
import { ReactComponent as Flow } from 'assets/icons/Flow Icon.svg';
import { ReactComponent as CrumpetLogo } from 'assets/images/Crumpet Logo Oxford.svg';

const environments = [
  { id: 1, name: 'Development' },
  { id: 2, name: 'Production' },
];

const SidebarMenu = () => {
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
        <div className="w-full flex justify-between items-center p-4 border-t border-crumpet-light-300">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center">
              C
            </div>
            <span className="text-base font-semibold">Crumpet</span>
          </div>
          <MdChevronRight className="fill-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
