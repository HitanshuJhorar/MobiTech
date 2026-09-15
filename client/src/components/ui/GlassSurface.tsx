import * as React from 'react';

interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export function GlassSurface({ children, className = '', dark = false, ...props }: GlassSurfaceProps) {
  const baseClass = dark ? 'glass-surface-dark' : 'glass-surface';
  return (
    <div className={`${baseClass} ${className}`} {...props}>
      {children}
    </div>
  );
}
