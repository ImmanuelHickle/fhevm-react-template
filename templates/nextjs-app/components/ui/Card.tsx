import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass';
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  variant = 'glass',
}) => {
  const variantStyles = {
    default: 'bg-gray-800 border-gray-700',
    gradient: 'bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30',
    glass: 'bg-white/10 backdrop-blur-lg border-white/20',
  };

  return (
    <div className={`rounded-2xl p-6 border ${variantStyles[variant]} ${className}`}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-semibold text-white mb-2">{title}</h2>
          )}
          {subtitle && (
            <p className="text-gray-300">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
