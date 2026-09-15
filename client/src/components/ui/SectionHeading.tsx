

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function SectionHeading({ title, subtitle, align = 'left', className = '' }: SectionHeadingProps) {
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <div className={`mb-10 ${alignments[align]} ${className}`}>
      <h2 className="text-h2 mb-3">{title}</h2>
      {subtitle && <p className="text-body-large max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}
