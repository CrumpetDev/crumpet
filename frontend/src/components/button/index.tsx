interface CustomButtonProps {
  text: string;
  onClick: () => void;
  styles?: string;
}

const CustomButton = ({ text, onClick, styles }: CustomButtonProps) => {
  return (
    <button onClick={onClick} className={`rounded-md bg-gray-600 py-2 px-8 text-white ${styles}`}>
      {text}
    </button>
  );
};

export default CustomButton;
