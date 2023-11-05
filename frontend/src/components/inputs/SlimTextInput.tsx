interface SlimTextInputProps {
  label: string;
  value?: string;
  error?: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const SlimTextInput = ({
  label,
  value,
  error,
  onChange,
  placeholder,
  inputProps,
  className,
}: SlimTextInputProps) => {
  return (
    <div className={`flex flex-col justify-start items-start gap-1 w-full ${className}`}>
      <p className="text-grey-700 text-xs font-semibold uppercase">{label}</p>
      <input
        className="p-2 w-full border-crumpet-light-300 border rounded outline-0 text-oxford text-sm"
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...inputProps}
      />
      <p className="text-sm text-red-500">{error}</p>
    </div>
  );
};

export default SlimTextInput;
