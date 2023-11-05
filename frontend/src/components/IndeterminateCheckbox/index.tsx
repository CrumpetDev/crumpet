import { HTMLProps, useEffect, useRef } from 'react';

const IndeterminateCheckbox = ({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) => {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <>
      <input
        ref={ref}
        className={`
      peer relative appearance-none shrink-0 w-4 h-4 rounded border border-oxford bg-white
      checked:bg-crumpet-yellow-500 checked:border-0
      indeterminate:text-gray-500
      disabled:border-steel-400 disabled:bg-steel-400
      ${className}
    `}
        type="checkbox"
        {...rest}
      />
      {indeterminate ? (
        <svg
          className="absolute w-4 h-4 px-0.5 pointer-events-none hidden peer-indeterminate:block"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24">
          <rect x="4" y="11" width="16" height="2" fill="#51493E" />
        </svg>
      ) : (
        <svg
          className="absolute w-4 h-4 p-0.5 pointer-events-none hidden peer-checked:block stroke-white outline-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      )}
    </>
  );
};

export default IndeterminateCheckbox;
