import { useRef } from 'react';
import { MdContentCopy } from 'react-icons/md';

interface CopyInputProps {
  label: string;
  description: string;
  value: string;
  className?: string;
}

const CopyInput = ({ label, description, value, className }: CopyInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopyClick = async () => {
    if (navigator.clipboard && inputRef.current) {
      try {
        await navigator.clipboard.writeText(inputRef.current.value);
        //TODO: Display subtle toast to user
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  return (
    <div className={`flex flex-col justify-start items-start gap-2 w-full ${className}`}>
      <div className="flex flex-col justify-start items-start gap-1">
        <h4 className="text-oxford text-sm font-semibold">{label}</h4>
        <p className="text-grey-700 text-sm">{description}</p>
      </div>
      <div
        className="flex flex-row justify-between items-center w-full p-2 border-crumpet-light-300 
                  border rounded outline-0 text-oxford text-sm font-ubuntu">
        <input className="w-full outline-none" ref={inputRef} type="text" readOnly value={value} />
        <MdContentCopy className="text-grey-500 hover:cursor-pointer" onClick={handleCopyClick} />
      </div>
    </div>
  );
};

export default CopyInput;
