import React, { ReactElement } from 'react';
import { MdExpandMore } from 'react-icons/md';

interface MainButtonProps {
  label: string;
  icon?: ReactElement;
  className?: string;
  enabled?: boolean;
  permanentlyDisabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

const ExtendedMainButton = ({
  label,
  icon,
  enabled = true,
  type = 'button',
  permanentlyDisabled = false,
  className,
  onClick,
}: MainButtonProps) => {
  const backgroundColor = enabled
    ? 'bg-crumpet-yellow-500 hover:bg-crumpet-yellow-600 border border-crumpet-yellow-600'
    : 'bg-crumpet-yellow-200';

  return (
    <div className="flex h-full">
      <button
        onClick={onClick}
        disabled={!enabled}
        type={type}
        className={` justify-start items-center gap-2 inline-flex h-full rounded-l p-2 text-sm font-semibold 
              ${backgroundColor} ${
          permanentlyDisabled ? 'border-grey-500 bg-grey-700 text-grey-200' : 'text-white'
        } 
              ${className}`}>
        {icon &&
          React.cloneElement(icon, {
            className: `text-base ${permanentlyDisabled ? 'text-grey-200' : 'text-white'}`,
          })}
        {label}
      </button>
      <button
        disabled={!enabled}
        className={`h-full p-2 ${backgroundColor} ${
          permanentlyDisabled ? 'border-grey-500 bg-grey-700' : ''
        } rounded-r ${className}`}>
        <MdExpandMore className={`text-base ${permanentlyDisabled ? 'text-grey-200' : 'text-white'}`} />
      </button>
    </div>
  );
};

export default ExtendedMainButton;
