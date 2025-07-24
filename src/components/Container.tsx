import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  size = 'lg',
  padding = 'md'
}) => {
  // Define max widths for different container sizes
  const sizeClasses = {
    sm: 'max-w-2xl',      // 672px
    md: 'max-w-4xl',      // 896px  
    lg: 'max-w-6xl',      // 1152px
    xl: 'max-w-7xl',      // 1280px
    full: 'max-w-full'    // No max width
  };

  // Define padding options
  const paddingClasses = {
    none: '',
    sm: 'px-4 py-2 sm:px-6 sm:py-4',
    md: 'px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8',
    lg: 'px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12'
  };

  return (
    <div
      className={`
        w-full mx-auto
        ${sizeClasses[size]}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Container;
