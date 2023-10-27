interface OutlineButtonProps {
  label: string;
  className?: string;
}

const OutlineButton = ({ label, className }: OutlineButtonProps) => {
  return (
    <button
      className={`rounded outline outline-1 
              outline-red-100 p-2 text-red-700 text-sm font-medium ${className}`}>
      {label}
    </button>
  );
};

export default OutlineButton;
