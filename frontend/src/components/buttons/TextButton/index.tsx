import React from 'react';
import { MdSettings } from 'react-icons/md';

interface TextButtonProps {
  text: string;
  icon?: React.ReactElement;
  onClick: () => void;
}
const TextButton = ({ text, icon, onClick }: TextButtonProps) => {
  return (
    <button className="justify-start items-center gap-2 inline-flex group" onClick={onClick}>
			{icon && React.cloneElement(icon, {
        className: "text-grey-700 group-hover:text-grey-500"
      })}
      <p className="text-sm text-grey-700 font-medium group-hover:text-grey-500">{text}</p>
    </button>
  );
};

export default TextButton;
