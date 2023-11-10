interface SoonLabelProps {
  className?: string;
}

const SoonLabel = ({ className }: SoonLabelProps) => {
  return (
    <div
      className={`inline-block px-2 py-1 rounded-full bg-crumpet-light-100 text-xs font-medium text-grey-700
                whitespace-nowrap ${className}`}>
      Soon
    </div>
  );
};

export default SoonLabel;
