import { useState } from 'react';
import { MissingRequest, User, RequestStatus } from '@/types';
import Icon from '@/components/ui/icon';
import RequestStatusBadge from '@/components/RequestStatusBadge';
import RequestTypeBadge from '@/components/RequestTypeBadge';

interface InspectorDashboardProps {
  currentUser: User;
  requests: MissingRequest[];
  activeSection: string;
  onUpdateStatus: (id: string, status: RequestStatus, comment: string, extendedText?: string) => void;
  onViewRequest: (req: MissingRequest) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function StatusUpdateModal({ request, onSave, onClose }: {
  request: MissingRequest;
  onSave: (status: RequestStatus, comment: string, extended?: string) => void;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<RequestStatus>(request.status === 'new' ? 'in_progress' : request.status);
  const [comment, setComment] = useState('');
  const [extended, setExtended] = useState('');

  const statusOptions: { value: RequestStatus; label: string; color: string }[] = [
    { value: 'in_progress', label: 'В работе', color: 'hsl(210 80% 48%)' },
    { value: 'done', label: 'Выполнено', color: 'hsl(142 65% 38%)' },
    { value: 'rejected', label: 'Отклонено', color: 'hsl(0 72% 51%)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-lg w-full max-w-lg animate-scale-in" style={{ border: '1px solid hsl(220 20% 88%)' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid hsl(220 20% 90%)' }}>
          <h3 className="font-semibold" style={{ color: 'hsl(220 30% 15%)' }}>Обновить статус заявки</h3>
          <button onClick={onClose} style={{ color: 'hsl(220 15% 55%)' }} onMouseEnter={e => e.currentTarget.style.color = 'hsl(220 30% 20%)'} onMouseLeave={e => e.currentTarget.style.color = 'hsl(220 15% 55%)'}>
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <div className="text-xs font-medium mb-1" style={{ color: 'hsl(220 15% 45%)' }}>Гражданин</div>
            <div className="font-medium" style={{ color: 'hsl(220 30% 15%)' }}>{request.lastName} {request.firstName} {request.middleName}</div>
          </div>

          <div>
            <div className="text-xs font-medium mb-2" style={{ color: 'hsl(220 15% 45%)' }}>Новый статус</div>
            <div className="flex gap-2">
              {statusOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setStatus(opt.value)}
                  className="flex-1 py-2 px-3 rounded text-xs font-medium transition-all"
                  style={{
                    background: status === opt.value ? opt.color : 'hsl(220 15% 95%)',
                    color: status === opt.value ? 'white' : 'hsl(220 15% 45%)',
                    border: `1px solid ${status === opt.value ? opt.color : 'hsl(220 20% 88%)'}`,
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(220 15% 45%)' }}>
              Комментарий
            </label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
              placeholder="Введите комментарий к статусу..."
              className="w-full px-3 py-2 rounded text-sm outline-none resize-none"
              style={{ border: '1px solid hsl(220 20% 85%)', background: 'hsl(220 15% 98%)' }}
              onFocus={e => e.target.style.borderColor = 'hsl(210 80% 55%)'}
              onBlur={e => e.target.style.borderColor = 'hsl(220 20% 85%)'}
            />
          </div>

          {status === 'done' && (
            <div className="animate-fade-in">
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(220 15% 45%)' }}>
                Расширенный комментарий (обязателен для статуса "Выполнено")
              </label>
              <textarea
                value={extended}
                onChange={e => setExtended(e.target.value)}
                rows={5}
                placeholder="Укажите подробную информацию: где установлен гражданин, учреждение, дата, контактные данные, обстоятельства..."
                className="w-full px-3 py-2 rounded text-sm outline-none resize-none"
                style={{ border: '1px solid hsl(210 80% 65%)', background: 'hsl(210 80% 98%)' }}
                onFocus={e => e.target.style.borderColor = 'hsl(210 80% 55%)'}
                onBlur={e => e.target.style.borderColor = 'hsl(210 80% 65%)'}
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 px-5 py-4" style={{ borderTop: '1px solid hsl(220 20% 90%)' }}>
          <button
            onClick={() => {
              if (!comment.trim()) return;
              if (status === 'done' && !extended.trim()) return;
              onSave(status, comment, extended || undefined);
              onClose();
            }}
            className="px-4 py-2 rounded text-sm font-medium text-white transition-all"
            style={{ background: 'hsl(210 80% 48%)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'hsl(210 80% 42%)'}
            onMouseLeave={e => e.currentTarget.style.background = 'hsl(210 80% 48%)'}>
            Сохранить
          </button>
          <button onClick={onClose}
            className="px-4 py-2 rounded text-sm font-medium"
            style={{ background: 'hsl(220 15% 92%)', color: 'hsl(220 30% 30%)' }}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

function RequestCard({ request, currentUser, onUpdateStatus }: {
  request: MissingRequest;
  currentUser: User;
  onUpdateStatus: (id: string, status: RequestStatus, comment: string, extended?: string) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg overflow-hidden animate-fade-in" style={{ border: '1px solid hsl(220 20% 88%)' }}>
      {showModal && (
        <StatusUpdateModal
          request={request}
          onSave={(status, comment, extended) => onUpdateStatus(request.id, status, comment, extended)}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <RequestTypeBadge type={request.type} />
              <RequestStatusBadge status={request.status} />
            </div>
            <h3 className="font-semibold text-base mt-2" style={{ color: 'hsl(220 30% 15%)' }}>
              {request.lastName} {request.firstName} {request.middleName}
            </h3>
            <div className="text-sm mt-0.5" style={{ color: 'hsl(220 15% 50%)' }}>
              Д.р.: {new Date(request.birthDate).toLocaleDateString('ru-RU')} · {request.gender === 'male' ? 'Мужской' : 'Женский'}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {(request.status === 'new' || request.status === 'in_progress') && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white"
                style={{ background: 'hsl(210 80% 48%)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'hsl(210 80% 42%)'}
                onMouseLeave={e => e.currentTarget.style.background = 'hsl(210 80% 48%)'}>
                <Icon name="Edit3" size={12} />
                Обновить статус
              </button>
            )}
            <button onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded transition-all"
              style={{ color: 'hsl(220 15% 55%)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'hsl(220 15% 93%)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Icon name={expanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-3">
          <InfoRow label="Последний адрес" value={request.lastKnownAddress} />
          <InfoRow label="Пропал" value={new Date(request.disappearanceDate).toLocaleDateString('ru-RU')} />
          <InfoRow label="Инициатор" value={request.authorName} />
          <InfoRow label="Создан" value={formatDate(request.createdAt)} />
        </div>

        {expanded && (
          <div className="mt-4 pt-4 space-y-3 animate-fade-in" style={{ borderTop: '1px solid hsl(220 20% 91%)' }}>
            <div>
              <div className="text-xs font-medium mb-1" style={{ color: 'hsl(220 15% 45%)' }}>Обстоятельства</div>
              <div className="text-sm" style={{ color: 'hsl(220 30% 25%)' }}>{request.circumstances}</div>
            </div>
            {request.medicalNotes && (
              <div>
                <div className="text-xs font-medium mb-1" style={{ color: 'hsl(220 15% 45%)' }}>Медицинские примечания</div>
                <div className="text-sm" style={{ color: 'hsl(220 30% 25%)' }}>{request.medicalNotes}</div>
              </div>
            )}
            {request.militaryUnit && (
              <div className="grid grid-cols-3 gap-4">
                <InfoRow label="Воинская часть" value={request.militaryUnit} />
                <InfoRow label="Звание" value={request.militaryRank || '—'} />
                <InfoRow label="Вид службы" value={request.serviceType || '—'} />
              </div>
            )}

            {request.comments.length > 0 && (
              <div>
                <div className="text-xs font-medium mb-2" style={{ color: 'hsl(220 15% 45%)' }}>История обработки</div>
                <div className="space-y-2">
                  {request.comments.map(c => (
                    <div key={c.id} className="p-3 rounded" style={{ background: 'hsl(220 15% 97%)', border: '1px solid hsl(220 20% 91%)' }}>
                      <div className="flex items-center gap-2 mb-1">
                        <RequestStatusBadge status={c.status} />
                        <span className="text-xs" style={{ color: 'hsl(220 15% 55%)' }}>{c.authorName} · {formatDate(c.createdAt)}</span>
                      </div>
                      <div className="text-sm" style={{ color: 'hsl(220 30% 25%)' }}>{c.text}</div>
                      {c.extendedText && (
                        <div className="mt-2 p-2 rounded text-sm" style={{ background: 'hsl(142 65% 38% / 0.08)', color: 'hsl(220 30% 25%)', borderLeft: '3px solid hsl(142 65% 38%)' }}>
                          {c.extendedText}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs" style={{ color: 'hsl(220 15% 55%)' }}>{label}</div>
      <div className="text-sm font-medium" style={{ color: 'hsl(220 30% 20%)' }}>{value}</div>
    </div>
  );
}

export default function InspectorDashboard({ currentUser, requests, activeSection, onUpdateStatus, onViewRequest }: InspectorDashboardProps) {
  const myRequests = requests.filter(r => r.assignedInspectorId === currentUser.id);
  const newRequests = requests.filter(r => r.status === 'new');
  const inProgressCount = myRequests.filter(r => r.status === 'in_progress').length;
  const doneCount = myRequests.filter(r => r.status === 'done').length;

  if (activeSection === 'dashboard') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl font-bold mb-1" style={{ color: 'hsl(220 30% 15%)' }}>Личный кабинет инспектора</h1>
          <p className="text-sm" style={{ color: 'hsl(220 15% 55%)' }}>{currentUser.fullName} · {currentUser.rank}</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Новых запросов', value: newRequests.length, color: 'hsl(38 90% 52%)', icon: 'Inbox' },
            { label: 'В работе', value: inProgressCount, color: 'hsl(210 80% 48%)', icon: 'Loader' },
            { label: 'Завершено мной', value: doneCount, color: 'hsl(142 65% 38%)', icon: 'CheckCircle' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-lg p-5 flex items-center gap-4" style={{ border: '1px solid hsl(220 20% 88%)' }}>
              <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}18` }}>
                <Icon name={s.icon} fallback="Circle" size={22} style={{ color: s.color }} />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: 'hsl(220 30% 15%)' }}>{s.value}</div>
                <div className="text-xs" style={{ color: 'hsl(220 15% 55%)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
        {newRequests.length > 0 && (
          <div className="bg-white rounded-lg p-5" style={{ border: '1px solid hsl(38 90% 52% / 0.3)', background: 'hsl(38 90% 52% / 0.04)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Icon name="AlertCircle" size={16} style={{ color: 'hsl(38 90% 52%)' }} />
              <h3 className="font-semibold text-sm" style={{ color: 'hsl(220 30% 15%)' }}>Ожидают принятия в работу</h3>
            </div>
            <div className="space-y-2">
              {newRequests.slice(0, 3).map(r => (
                <div key={r.id} onClick={() => onViewRequest(r)}
                  className="flex items-center gap-3 p-2 rounded cursor-pointer transition-all"
                  onMouseEnter={e => e.currentTarget.style.background = 'hsl(38 90% 52% / 0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <RequestTypeBadge type={r.type} />
                  <span className="text-sm font-medium flex-1" style={{ color: 'hsl(220 30% 20%)' }}>{r.lastName} {r.firstName} {r.middleName}</span>
                  <span className="text-xs" style={{ color: 'hsl(220 15% 55%)' }}>{new Date(r.createdAt).toLocaleDateString('ru-RU')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeSection === 'requests') {
    return (
      <div className="space-y-4 animate-fade-in">
        <h1 className="text-xl font-bold" style={{ color: 'hsl(220 30% 15%)' }}>Входящие запросы</h1>
        <div className="space-y-3">
          {requests.filter(r => r.status === 'new').map(r => (
            <RequestCard key={r.id} request={r} currentUser={currentUser} onUpdateStatus={onUpdateStatus} />
          ))}
          {requests.filter(r => r.status === 'new').length === 0 && (
            <div className="text-center py-12" style={{ color: 'hsl(220 15% 55%)' }}>
              <Icon name="CheckCircle" size={40} className="mx-auto mb-2 opacity-30" />
              <div className="text-sm">Новых запросов нет</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeSection === 'my_work') {
    return (
      <div className="space-y-4 animate-fade-in">
        <h1 className="text-xl font-bold" style={{ color: 'hsl(220 30% 15%)' }}>Мои дела</h1>
        <div className="space-y-3">
          {myRequests.map(r => (
            <RequestCard key={r.id} request={r} currentUser={currentUser} onUpdateStatus={onUpdateStatus} />
          ))}
          {myRequests.length === 0 && (
            <div className="text-center py-12" style={{ color: 'hsl(220 15% 55%)' }}>
              <Icon name="Briefcase" size={40} className="mx-auto mb-2 opacity-30" />
              <div className="text-sm">Вы пока не принимали дела в работу</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeSection === 'history') {
    const closed = requests.filter(r => r.status === 'done' || r.status === 'rejected');
    return (
      <div className="space-y-4 animate-fade-in">
        <h1 className="text-xl font-bold" style={{ color: 'hsl(220 30% 15%)' }}>История запросов</h1>
        <div className="space-y-3">
          {closed.map(r => <RequestCard key={r.id} request={r} currentUser={currentUser} onUpdateStatus={onUpdateStatus} />)}
          {closed.length === 0 && <div className="text-center py-12 text-sm" style={{ color: 'hsl(220 15% 55%)' }}>Закрытых запросов нет</div>}
        </div>
      </div>
    );
  }

  if (activeSection === 'reports') {
    return (
      <div className="space-y-4 animate-fade-in">
        <h1 className="text-xl font-bold" style={{ color: 'hsl(220 30% 15%)' }}>Отчёт инспектора</h1>
        <div className="bg-white rounded-lg p-6" style={{ border: '1px solid hsl(220 20% 88%)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'hsl(220 30% 15%)' }}>Моя статистика</h3>
          <div className="space-y-3">
            {[
              { label: 'Принято в работу', value: myRequests.length },
              { label: 'Успешно завершено', value: doneCount },
              { label: 'Отклонено', value: myRequests.filter(r => r.status === 'rejected').length },
              { label: 'В процессе', value: inProgressCount },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded" style={{ background: 'hsl(220 15% 97%)' }}>
                <span className="text-sm" style={{ color: 'hsl(220 30% 25%)' }}>{item.label}</span>
                <span className="font-bold" style={{ color: 'hsl(220 30% 15%)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
