import { RequestStatus } from '@/types';

const STATUS_CONFIG: Record<RequestStatus, { label: string; className: string }> = {
  new: { label: 'Новая', className: 'status-badge-new' },
  in_progress: { label: 'В работе', className: 'status-badge-active' },
  done: { label: 'Выполнено', className: 'status-badge-done' },
  rejected: { label: 'Отклонено', className: 'status-badge-rejected' },
};

export default function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
