interface CustomButtonProps {
  text: string;
  onClick: () => void;
  styles?: string;
	icon?: React.ReactElement;
}

const CustomButton = ({ text, onClick, styles, icon }: CustomButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center rounded-md bg-gray-600 py-2 px-8 text-white ${styles}`}>
      {text}
			{icon && <span className="ml-4">{icon}</span>}
    </button>
  );
};

export default CustomButton;
