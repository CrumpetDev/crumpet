import { IndeterminateCheckbox } from 'components';
import React from 'react';

interface SegmentSelectorProps {
  isSelected: boolean;
}

const SegmentSelector = ({ isSelected }: SegmentSelectorProps) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <span
        className={`text-sm ${
          isSelected ? 'font-semibold text-oxford' : 'font-normal text-grey-900'
        }`}>
        All
      </span>
      <IndeterminateCheckbox checked={isSelected} />
    </div>
  );
};

export default SegmentSelector;
