type SidebarButtonProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  widthFill?: boolean;
  selected?: boolean;
};

const SidebarButtonPrimary = ({
  icon,
  label,
  onClick,
  widthFill = false,
  selected = false,
}: SidebarButtonProps) => {
  return (
    <button
			onClick={onClick}
      className={`${widthFill ? 'w-full' : ''} ${
        selected ? 'bg-crumpet-light-200' : ''
      } hover:bg-crumpet-light-200 text-oxford font-bold p-2 rounded-md justify-start gap-3 
				inline-flex items-center`}>
      {icon}
      <div className="text-slate-900 text-sm font-semibold">{label}</div>
    </button>
  );
};

export default SidebarButtonPrimary;
