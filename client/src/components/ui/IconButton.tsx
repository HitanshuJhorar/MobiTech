import * as React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: 'ghost' | 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function IconButton({ 
  icon: Icon, 
  variant = 'ghost', 
  size = 'md',
  className = '', 
  ...props 
}: IconButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-dark-teal focus:ring-offset-2';
  
  const variants = {
    ghost: 'text-primary-dark hover:bg-black/5',
    solid: 'bg-white text-primary-dark shadow-sm hover:bg-gray-50 border border-gray-100',
    outline: 'border border-primary-dark/20 text-primary-dark hover:bg-black/5'
  };

  const sizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <Icon size={iconSizes[size]} strokeWidth={1.5} />
    </button>
  );
}
