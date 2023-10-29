import React, { useRef } from 'react';
import { FiCopy } from 'react-icons/fi';

interface CopyInputProps {
  value: string;
  className?: string;
}

//TODO: Add Radix tooltip when value is copied
// https://www.radix-ui.com/primitives/docs/components/tooltip
const CopyInput: React.FC<CopyInputProps> = ({ value, className }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopyClick = () => {
    if (inputRef.current) {
      inputRef.current.select();
      document.execCommand('copy');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        readOnly
        className="pl-3 pr-10 w-full border rounded"
      />
      <div
        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
        onClick={handleCopyClick}
      >
        <FiCopy />
      </div>
    </div>
  );
};

export default CopyInput;

