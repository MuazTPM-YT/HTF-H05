import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Define cn function directly
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const Switch = ({ className, defaultChecked = false, ...props }) => {
  const [checked, setChecked] = React.useState(defaultChecked);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      onClick={() => setChecked(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        checked ? 'bg-blue-600' : 'bg-gray-200',
        className
      )}
      {...props}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
};

export { Switch }; 