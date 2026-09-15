import * as React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'dark';
}

export function Card({ children, className = '', variant = 'default', ...props }: CardProps) {
  const variants = {
    default: 'bg-white rounded-3xl shadow-card border border-light-neutral/50',
    glass: 'glass-surface rounded-3xl',
    dark: 'bg-primary-dark-teal rounded-3xl text-white shadow-card'
  };

  return (
    <div className={`overflow-hidden transition-shadow duration-300 hover:shadow-elevated ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
