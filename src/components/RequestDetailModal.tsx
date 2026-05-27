import { MissingRequest } from '@/types';
import Icon from '@/components/ui/icon';
import RequestStatusBadge from '@/components/RequestStatusBadge';
import RequestTypeBadge from '@/components/RequestTypeBadge';

interface Props {
  request: MissingRequest;
  onClose: () => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 py-2" style={{ borderBottom: '1px solid hsl(220 20% 93%)' }}>
      <div className="w-44 text-xs flex-shrink-0" style={{ color: 'hsl(220 15% 50%)' }}>{label}</div>
      <div className="text-sm" style={{ color: 'hsl(220 30% 20%)' }}>{value || '—'}</div>
    </div>
  );
}

export default function RequestDetailModal({ request, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in"
        style={{ border: '1px solid hsl(220 20% 85%)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid hsl(220 20% 90%)' }}>
          <div className="flex items-center gap-2">
            <RequestTypeBadge type={request.type} />
            <RequestStatusBadge status={request.status} />
          </div>
          <button onClick={onClose} className="p-1.5 rounded transition-all"
            style={{ color: 'hsl(220 15% 55%)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'hsl(220 15% 92%)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'hsl(220 30% 15%)' }}>
              {request.lastName} {request.firstName} {request.middleName}
            </h2>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'hsl(220 15% 50%)' }}>Личные данные</h4>
            <Row label="Дата рождения" value={new Date(request.birthDate).toLocaleDateString('ru-RU')} />
            <Row label="Пол" value={request.gender === 'male' ? 'Мужской' : 'Женский'} />
            <Row label="Последний адрес" value={request.lastKnownAddress} />
            <Row label="Дата исчезновения" value={new Date(request.disappearanceDate).toLocaleDateString('ru-RU')} />
            <Row label="Обстоятельства" value={request.circumstances} />
          </div>

          {request.type === 'medical' && request.medicalNotes && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'hsl(220 15% 50%)' }}>Медицинские сведения</h4>
              <Row label="Примечания" value={request.medicalNotes} />
            </div>
          )}

          {request.type === 'military' && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'hsl(220 15% 50%)' }}>Военная служба</h4>
              <Row label="Воинская часть" value={request.militaryUnit || '—'} />
              <Row label="Звание" value={request.militaryRank || '—'} />
              <Row label="Вид службы" value={request.serviceType || '—'} />
            </div>
          )}

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'hsl(220 15% 50%)' }}>Информация о запросе</h4>
            <Row label="Инициатор" value={request.authorName} />
            <Row label="Подразделение" value={request.authorDepartment} />
            <Row label="Инспектор" value={request.assignedInspectorName || 'Не назначен'} />
            <Row label="Создан" value={formatDate(request.createdAt)} />
            <Row label="Обновлён" value={formatDate(request.updatedAt)} />
          </div>

          {request.comments.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'hsl(220 15% 50%)' }}>История обработки</h4>
              <div className="space-y-3">
                {request.comments.map(c => (
                  <div key={c.id} className="p-3 rounded" style={{ background: 'hsl(220 15% 97%)', border: '1px solid hsl(220 20% 91%)' }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <RequestStatusBadge status={c.status} />
                      <span className="text-xs" style={{ color: 'hsl(220 15% 55%)' }}>{c.authorName}</span>
                      <span className="text-xs" style={{ color: 'hsl(220 15% 65%)' }}>· {formatDate(c.createdAt)}</span>
                    </div>
                    <div className="text-sm" style={{ color: 'hsl(220 30% 25%)' }}>{c.text}</div>
                    {c.extendedText && (
                      <div className="mt-2 p-3 rounded text-sm leading-relaxed"
                        style={{ background: 'hsl(142 65% 38% / 0.07)', borderLeft: '3px solid hsl(142 65% 38%)', color: 'hsl(220 30% 20%)' }}>
                        <div className="text-xs font-medium mb-1" style={{ color: 'hsl(142 65% 38%)' }}>Расширенный комментарий</div>
                        {c.extendedText}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-3 flex-shrink-0" style={{ borderTop: '1px solid hsl(220 20% 90%)' }}>
          <button onClick={onClose}
            className="px-4 py-2 rounded text-sm font-medium"
            style={{ background: 'hsl(220 15% 92%)', color: 'hsl(220 30% 30%)' }}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
