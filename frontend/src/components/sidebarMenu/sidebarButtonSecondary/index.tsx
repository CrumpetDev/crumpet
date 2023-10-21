type SidebarButtonProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  widthFill?: boolean;
  secondaryIcon?: React.ReactNode;
};

const SidebarButtonSecondary = ({
  icon,
  label,
  onClick,
  widthFill = false,
  secondaryIcon,
}: SidebarButtonProps) => {
  return (
    <button
			onClick={onClick}
      className={`${
        widthFill ? 'w-full' : ''
      } bg-transparent hover:text-crumpet-dark-300 text-crumpet-dark-500 
				p-2 rounded-md justify-start gap-3 inline-flex items-center`}>
      {icon}
      <div className="text-sm font-semibold">{label}</div>
      <div className="ml-auto fill-crumpet-dark-500">{secondaryIcon}</div>
    </button>
  );
};

export default SidebarButtonSecondary;
