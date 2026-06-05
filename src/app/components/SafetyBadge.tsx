import { getSafetyConfig } from '../data/mockData';
import type { Ingredient } from '../data/mockData';

interface SafetyBadgeProps {
  safety: Ingredient['safety'];
  size?: 'sm' | 'md';
}

export function SafetyBadge({ safety, size = 'sm' }: SafetyBadgeProps) {
  const config = getSafetyConfig(safety);
  return (
    <span
      className="flex-none px-2 py-0.5 rounded-full font-medium"
      style={{
        background: config.bg,
        color: config.text,
        fontSize: size === 'sm' ? '11px' : '13px',
      }}
    >
      {config.label}
    </span>
  );
}
