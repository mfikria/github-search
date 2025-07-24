import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  leftIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, leftIcon: LeftIcon, className = '', ...props }, ref) => {
    return (
      <div className="relative">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LeftIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          className={`
            block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 
            placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 
            ${LeftIcon ? 'pl-10' : 'pl-3'} pr-3
            ${className}
          `}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
