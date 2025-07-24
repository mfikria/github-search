'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from './icons';

interface AccordionItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  onCustomToggle?: (isOpen: boolean) => void; // Add custom toggle handler
  disabled?: boolean;
  className?: string;
}

interface AccordionProps {
  children: React.ReactElement<AccordionItemProps> | React.ReactElement<AccordionItemProps>[];
  allowMultiple?: boolean;
  defaultOpenItems?: number[];
  className?: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  isOpen = false,
  onToggle,
  onCustomToggle,
  disabled = false,
  className = ''
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen, children]);

  return (
    <div className={`border border-gray-200 rounded-lg ${className}`}>
      <button
        className={`
          w-full px-4 py-3 text-left flex items-center justify-between
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
          transition-colors duration-200 rounded-lg
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={() => {
          onToggle?.();
          onCustomToggle?.(!isOpen);
        }}
        disabled={disabled}
        aria-expanded={isOpen}
      >
        <div className="font-medium text-gray-900 flex-1">{title}</div>
        <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          )}
        </span>
      </button>
      
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ height: `${contentHeight}px` }}
      >
        <div className="px-4 pb-4 pt-2 text-gray-700 border-t border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
};



const Accordion: React.FC<AccordionProps> = ({
  children,
  allowMultiple = false,
  defaultOpenItems = [],
  className = ''
}) => {
  const [openItems, setOpenItems] = useState<Set<number>>(
    new Set(defaultOpenItems)
  );

  const handleToggle = (index: number) => {
    setOpenItems(prev => {
      const newOpenItems = new Set(prev);
      
      if (newOpenItems.has(index)) {
        newOpenItems.delete(index);
      } else {
        if (!allowMultiple) {
          newOpenItems.clear();
        }
        newOpenItems.add(index);
      }
      
      return newOpenItems;
    });
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;
        
        return React.cloneElement(child, {
          isOpen: openItems.has(index),
          onToggle: () => handleToggle(index),
          onCustomToggle: child.props.onCustomToggle,
          key: index
        });
      })}
    </div>
  );
};

export { Accordion, AccordionItem };
export default Accordion;
