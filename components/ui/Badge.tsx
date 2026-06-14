/**
 * Badge component
 * Small reusable label chip with semantic colour variants.
 * Used for tags, labels, and status indicators throughout the app.
 */

interface BadgeProps {
  label:    string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?:    'sm' | 'md';
}

const VARIANTS: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-[#1E2740]           text-[#94A3B8] border-[#263354]',
  primary: 'bg-[#6366F1]/15        text-[#818CF8] border-[#6366F1]/25',
  success: 'bg-[#22C55E]/15        text-[#22C55E] border-[#22C55E]/25',
  warning: 'bg-[#F59E0B]/15        text-[#F59E0B] border-[#F59E0B]/25',
  danger:  'bg-[#EF4444]/15        text-[#EF4444] border-[#EF4444]/25',
};

const SIZES: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs     px-2   py-0.5',
};

export default function Badge({ label, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-semibold rounded border
        ${VARIANTS[variant]} ${SIZES[size]}
      `}
    >
      {label}
    </span>
  );
}