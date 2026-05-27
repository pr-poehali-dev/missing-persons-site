import { RequestType } from '@/types';
import Icon from '@/components/ui/icon';

const TYPE_CONFIG: Record<RequestType, { label: string; icon: string; color: string }> = {
  medical: { label: 'Медучреждение', icon: 'Hospital', color: 'hsl(280 60% 50%)' },
  military: { label: 'Военнослужащий', icon: 'Star', color: 'hsl(30 80% 50%)' },
};

export default function RequestTypeBadge({ type }: { type: RequestType }) {
  const cfg = TYPE_CONFIG[type];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
      style={{
        background: `${cfg.color}18`,
        color: cfg.color,
        border: `1px solid ${cfg.color}40`,
      }}>
      <Icon name={cfg.icon} fallback="Circle" size={11} />
      {cfg.label}
    </span>
  );
}
