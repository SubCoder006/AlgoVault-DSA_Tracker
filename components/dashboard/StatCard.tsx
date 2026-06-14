/**
 * StatCard component
 * Displays a single KPI metric with an icon badge, large number,
 * and an optional change annotation. A subtle gradient glow sits
 * behind the icon and intensifies on hover.
 */

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title:             string;
  value:             number | string;
  icon:              LucideIcon;
  gradient?:         string;   // Tailwind gradient classes, e.g. "from-[#6366F1] to-[#8B5CF6]"
  change?:           string;   // e.g. "73% of total"
  changePositive?:   boolean;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  gradient    = 'from-[#6366F1] to-[#8B5CF6]',
  change,
  changePositive = true,
}: StatCardProps) {
  return (
    <div className="card p-5 group relative overflow-hidden">

      {/* Background ambient glow */}
      <div
        className={`
          absolute -top-6 -right-6 w-28 h-28 rounded-full blur-2xl
          bg-gradient-to-br ${gradient} opacity-5
          group-hover:opacity-12 transition-opacity duration-500
        `}
      />

      <div className="relative flex items-start justify-between gap-2">
        {/* Text */}
        <div>
          <p className="text-xs text-[#475569] font-medium mb-1 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-extrabold text-[#F1F5F9] leading-none">
            {value}
          </p>
          {change && (
            <p className={`text-[11px] mt-1.5 font-medium ${changePositive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
              {change}
            </p>
          )}
        </div>

        {/* Icon badge */}
        <div className={`shrink-0 p-2.5 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
    </div>
  );
}