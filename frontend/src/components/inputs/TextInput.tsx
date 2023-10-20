interface TextInputProps {
  label: string;
  description: string;
  value: string;
  error?: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const TextInput = ({
  label,
  description,
  value,
  error,
  onChange,
  placeholder,
  inputProps,
  className,
}: TextInputProps) => {
  return (
    <div className={`flex flex-col justify-start items-start gap-2 w-full ${className}`}>
      <div className="flex flex-col justify-start items-start gap-1">
        <h4 className="text-oxford text-sm font-semibold">{label}</h4>
        <p className="text-grey-700 text-sm">{description}</p>
      </div>
      <div className="flex flex-col justify-start items-start gap-1 w-full">
        <input
          className="
            p-2
            w-full
						border-crumpet-light-300
            border
            rounded
            outline-0 text-oxford text-sm"
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...inputProps}
        />
        <p className="text-sm text-red-500">{error}</p>
      </div>
    </div>
  );
};

export default TextInput;
