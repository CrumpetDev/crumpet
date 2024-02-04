import React, { ReactElement } from 'react';

interface MainButtonProps {
  label: string;
  icon?: ReactElement;
  className?: string;
  enabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

const MainButton = ({
  label,
  icon,
  enabled = true,
  type = 'button',
  className,
  onClick,
}: MainButtonProps) => {
  const backgroundColor = enabled
    ? 'bg-crumpet-yellow-500 hover:bg-crumpet-yellow-600 outline border border-crumpet-yellow-600'
    : 'bg-crumpet-yellow-200';
  return (
    <button
      onClick={onClick}
      disabled={!enabled}
      type={type}
      className={` justify-start items-center gap-2 inline-flex rounded p-2 text-white text-sm font-semibold 
              ${backgroundColor} ${className}`}>
      {icon &&
        React.cloneElement(icon, {
          className: 'text-white text-base',
        })}
      {label}
    </button>
  );
};

export default MainButton;
