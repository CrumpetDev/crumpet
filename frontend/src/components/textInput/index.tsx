interface TextInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
}

const TextInput = ({
  label,
  value,
  onChange,
  placeholder,
  inputProps,
  labelStyle,
  containerStyle,
  inputStyle,
}: TextInputProps) => {
  return (
    <div className={`flex flex-col justify-between items-start w-full ${containerStyle}`}>
      <p className={`font-bold mb-2 ${labelStyle}`}>{label}</p>
      <input
        className={`
            py-1
            w-full
            border-gray-200
            border-2
            rounded-md
            px-2
            focus:border-gray-400
            outline-0 ${inputStyle}
        `}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...inputProps}
      />
    </div>
  );
};

export default TextInput;
