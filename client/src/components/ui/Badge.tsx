import * as React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'white';
  className?: string;
}

export function Badge({ children, variant = 'primary', className = '', ...props }: BadgeProps) {
  const variants = {
    primary: 'bg-primary-dark-teal text-white',
    secondary: 'bg-accent-sand text-primary-dark',
    outline: 'bg-transparent border border-primary-dark-teal text-primary-dark-teal',
    white: 'bg-white text-primary-dark shadow-sm'
  };

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
