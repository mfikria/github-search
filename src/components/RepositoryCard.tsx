import React from 'react';
import { StarIcon } from './icons';

interface RepositoryCardProps {
  title: string;
  description?: string | null;
  starCount: number;
  className?: string;
  onClick?: () => void;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({
  title,
  description,
  starCount,
  className = '',
  onClick
}) => {
  return (
    <div
      className={`
        relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200
        ${onClick ? 'cursor-pointer hover:border-gray-300' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Star counter in top right */}
      <div className="absolute top-3 right-3 flex items-center gap-1 text-gray-600">
        <StarIcon className="h-4 w-4" />
        <span className="text-sm font-medium">{starCount.toLocaleString()}</span>
      </div>

      {/* Repository title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-16 truncate">
        {title}
      </h3>

      {/* Repository description */}
      {description && (
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}

      {/* Placeholder when no description */}
      {!description && (
        <p className="text-gray-400 text-sm italic">
          No description available
        </p>
      )}
    </div>
  );
};

export default RepositoryCard;
