import React from 'react';
import { MdSettings } from 'react-icons/md';

interface TextButtonProps {
  label: string;
  icon?: React.ReactElement;
  enabled?: boolean;
  onClick?: () => void;
  color?: string;
}
const TextButton = ({ label, icon, enabled = true, onClick, color: propColor }: TextButtonProps) => {
  const color = enabled ? `text-grey-700 group-hover:text-grey-500 ${propColor}` : 'text-grey-500';
  return (
    <button
      disabled={!enabled}
      className={`justify-start items-center gap-2 inline-flex group`}
      onClick={onClick}>
      {icon &&
        React.cloneElement(icon, {
          className: color,
        })}
      <p className={`text-sm font-medium ${color}`}>{label}</p>
    </button>
  );
};

export default TextButton;
