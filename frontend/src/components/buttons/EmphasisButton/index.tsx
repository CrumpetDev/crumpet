interface EmphasisButtonProps {
  text: string;
  variant?: 'primary' | 'secondary';
  enabled?: boolean;
	type?: 'button' | 'submit' | 'reset';
  onClick: () => void;
  className?: string;
  icon?: React.ReactElement;
}

const EmphasisButton = ({
  text,
  variant = 'primary',
  enabled = true,
	type = 'button',
  onClick,
  className,
  icon,
}: EmphasisButtonProps) => {
  const baseStyles = 'flex items-center justify-center rounded-lg px-8 py-2 text-sm font-semibold';
  const primaryStyles = 'bg-radial-light hover:bg-radial-ultra-light shadow-light text-white';
  const secondaryStyles =
    'bg-white border border-crumpet-light-300 text-oxford shadow-light hover:bg-crumpet-light-100';
  const disabledStyles = 'bg-crumpet-light-50 border-crumpet-light-300 text-grey-700';

  const buttonStyles = enabled
    ? variant === 'primary'
      ? primaryStyles
      : secondaryStyles
    : disabledStyles;

  return (
    <button
			type={type}
      onClick={enabled ? onClick : undefined}
      className={`${baseStyles} ${buttonStyles} ${className}`}
      disabled={!enabled}>
      {text}
      {icon && <span className="ml-4">{icon}</span>}
    </button>
  );
};

export default EmphasisButton;
