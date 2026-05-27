import { useState } from 'react';
import { MissingRequest, User, RequestType } from '@/types';
import Icon from '@/components/ui/icon';
import RequestStatusBadge from '@/components/RequestStatusBadge';
import RequestTypeBadge from '@/components/RequestTypeBadge';

interface OfficerDashboardProps {
  currentUser: User;
  requests: MissingRequest[];
  activeSection: string;
  onCreateRequest: (data: Omit<MissingRequest, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'status'>) => void;
  onViewRequest: (req: MissingRequest) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const emptyForm = {
  type: 'medical' as RequestType,
  lastName: '', firstName: '', middleName: '',
  birthDate: '', gender: 'male' as 'male' | 'female',
  lastKnownAddress: '', disappearanceDate: '', circumstances: '',
  medicalNotes: '', militaryUnit: '', militaryRank: '', serviceType: '',
};

function NewRequestForm({ currentUser, onSubmit, onCancel }: {
  currentUser: User;
  onSubmit: (data: Omit<MissingRequest, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'status'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.lastName) e.lastName = 'Обязательное поле';
    if (!form.firstName) e.firstName = 'Обязательное поле';
    if (!form.birthDate) e.birthDate = 'Обязательное поле';
    if (!form.lastKnownAddress) e.lastKnownAddress = 'Обязательное поле';
    if (!form.disappearanceDate) e.disappearanceDate = 'Обязательное поле';
    if (!form.circumstances) e.circumstances = 'Обязательное поле';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      type: form.type,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorDepartment: currentUser.department,
      lastName: form.lastName,
      firstName: form.firstName,
      middleName: form.middleName,
      birthDate: form.birthDate,
      gender: form.gender,
      lastKnownAddress: form.lastKnownAddress,
      disappearanceDate: form.disappearanceDate,
      circumstances: form.circumstances,
      medicalNotes: form.type === 'medical' ? form.medicalNotes : undefined,
      militaryUnit: form.type === 'military' ? form.militaryUnit : undefined,
      militaryRank: form.type === 'military' ? form.militaryRank : undefined,
      serviceType: form.type === 'military' ? form.serviceType : undefined,
    });
    onCancel();
  };

  const fieldClass = "w-full px-3 py-2 rounded text-sm outline-none transition-all";
  const fieldStyle = { border: '1px solid hsl(220 20% 85%)', background: 'hsl(220 15% 98%)' };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      {/* Тип запроса */}
      <div className="bg-white rounded-lg p-5" style={{ border: '1px solid hsl(220 20% 88%)' }}>
        <h3 className="font-semibold text-sm mb-3" style={{ color: 'hsl(220 30% 15%)' }}>Тип запроса</h3>
        <div className="grid grid-cols-2 gap-3">
          {([
            { value: 'medical', label: 'Поиск в медицинских учреждениях', icon: 'Hospital', desc: 'Запрос о нахождении гражданина в больницах и медучреждениях Орловской области' },
            { value: 'military', label: 'Статус военнослужащего', icon: 'Star', desc: 'Запрос о статусе и местонахождении военнослужащего' },
          ] as const).map(opt => (
            <button
              type="button"
              key={opt.value}
              onClick={() => set('type', opt.value)}
              className="p-4 rounded-lg text-left transition-all"
              style={{
                border: `2px solid ${form.type === opt.value ? 'hsl(210 80% 48%)' : 'hsl(220 20% 88%)'}`,
                background: form.type === opt.value ? 'hsl(210 80% 48% / 0.06)' : 'white',
              }}>
              <Icon name={opt.icon} fallback="Circle" size={20} className="mb-2"
                style={{ color: form.type === opt.value ? 'hsl(210 80% 48%)' : 'hsl(220 15% 55%)' }} />
              <div className="font-medium text-sm" style={{ color: 'hsl(220 30% 15%)' }}>{opt.label}</div>
              <div className="text-xs mt-1" style={{ color: 'hsl(220 15% 55%)' }}>{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Данные о пропавшем */}
      <div className="bg-white rounded-lg p-5" style={{ border: '1px solid hsl(220 20% 88%)' }}>
        <h3 className="font-semibold text-sm mb-4" style={{ color: 'hsl(220 30% 15%)' }}>Данные о разыскиваемом лице</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          {[
            { key: 'lastName', label: 'Фамилия *', placeholder: 'Иванов' },
            { key: 'firstName', label: 'Имя *', placeholder: 'Иван' },
            { key: 'middleName', label: 'Отчество', placeholder: 'Иванович' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium mb-1" style={{ color: 'hsl(220 15% 45%)' }}>{f.label}</label>
              <input value={(form as Record<string, string>)[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder}
                className={fieldClass} style={{ ...fieldStyle, borderColor: errors[f.key] ? 'hsl(0 72% 51%)' : 'hsl(220 20% 85%)' }}
                onFocus={e => e.target.style.borderColor = 'hsl(210 80% 55%)'}
                onBlur={e => e.target.style.borderColor = errors[f.key] ? 'hsl(0 72% 51%)' : 'hsl(220 20% 85%)'} />
              {errors[f.key] && <div className="text-xs mt-0.5" style={{ color: 'hsl(0 72% 51%)' }}>{errors[f.key]}</div>}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'hsl(220 15% 45%)' }}>Дата рождения *</label>
            <input type="date" value={form.birthDate} onChange={e => set('birthDate', e.target.value)}
              className={fieldClass} style={{ ...fieldStyle, borderColor: errors.birthDate ? 'hsl(0 72% 51%)' : 'hsl(220 20% 85%)' }}
              onFocus={e => e.target.style.borderColor = 'hsl(210 80% 55%)'}
              onBlur={e => e.target.style.borderColor = 'hsl(220 20% 85%)'} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'hsl(220 15% 45%)' }}>Пол</label>
            <select value={form.gender} onChange={e => set('gender', e.target.value)} className={fieldClass} style={fieldStyle}>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'hsl(220 15% 45%)' }}>Дата исчезновения *</label>
            <input type="date" value={form.disappearanceDate} onChange={e => set('disappearanceDate', e.target.value)}
              className={fieldClass} style={{ ...fieldStyle, borderColor: errors.disappearanceDate ? 'hsl(0 72% 51%)' : 'hsl(220 20% 85%)' }}
              onFocus={e => e.target.style.borderColor = 'hsl(210 80% 55%)'}
              onBlur={e => e.target.style.borderColor = 'hsl(220 20% 85%)'} />
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-xs font-medium mb-1" style={{ color: 'hsl(220 15% 45%)' }}>Последний известный адрес *</label>
          <input value={form.lastKnownAddress} onChange={e => set('lastKnownAddress', e.target.value)}
            placeholder="г. Орёл, ул. Ленина, 1"
            className={fieldClass} style={{ ...fieldStyle, borderColor: errors.lastKnownAddress ? 'hsl(0 72% 51%)' : 'hsl(220 20% 85%)' }}
            onFocus={e => e.target.style.borderColor = 'hsl(210 80% 55%)'}
            onBlur={e => e.target.style.borderColor = 'hsl(220 20% 85%)'} />
        </div>
        <div className="mt-3">
          <label className="block text-xs font-medium mb-1" style={{ color: 'hsl(220 15% 45%)' }}>Обстоятельства исчезновения *</label>
          <textarea value={form.circumstances} onChange={e => set('circumstances', e.target.value)} rows={3}
            placeholder="Опишите обстоятельства исчезновения..."
            className={`${fieldClass} resize-none`} style={{ ...fieldStyle, borderColor: errors.circumstances ? 'hsl(0 72% 51%)' : 'hsl(220 20% 85%)' }}
            onFocus={e => e.target.style.borderColor = 'hsl(210 80% 55%)'}
            onBlur={e => e.target.style.borderColor = 'hsl(220 20% 85%)'} />
        </div>
      </div>

      {/* Специфичные поля */}
      {form.type === 'medical' && (
        <div className="bg-white rounded-lg p-5 animate-fade-in" style={{ border: '1px solid hsl(220 20% 88%)' }}>
          <h3 className="font-semibold text-sm mb-3" style={{ color: 'hsl(220 30% 15%)' }}>Медицинские сведения</h3>
          <label className="block text-xs font-medium mb-1" style={{ color: 'hsl(220 15% 45%)' }}>Медицинские примечания</label>
          <textarea value={form.medicalNotes} onChange={e => set('medicalNotes', e.target.value)} rows={3}
            placeholder="Хронические заболевания, особые нужды, принимаемые медикаменты..."
            className={`${fieldClass} resize-none`} style={fieldStyle}
            onFocus={e => e.target.style.borderColor = 'hsl(210 80% 55%)'}
            onBlur={e => e.target.style.borderColor = 'hsl(220 20% 85%)'} />
        </div>
      )}

      {form.type === 'military' && (
        <div className="bg-white rounded-lg p-5 animate-fade-in" style={{ border: '1px solid hsl(220 20% 88%)' }}>
          <h3 className="font-semibold text-sm mb-3" style={{ color: 'hsl(220 30% 15%)' }}>Сведения о военной службе</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'militaryUnit', label: 'Воинская часть', placeholder: 'В/ч 00000' },
              { key: 'militaryRank', label: 'Номер жетона', placeholder: 'Если известно' },
              { key: 'serviceType', label: 'Вид службы', placeholder: 'Срочная служба' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium mb-1" style={{ color: 'hsl(220 15% 45%)' }}>{f.label}</label>
                <input value={(form as Record<string, string>)[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder}
                  className={fieldClass} style={fieldStyle}
                  onFocus={e => e.target.style.borderColor = 'hsl(210 80% 55%)'}
                  onBlur={e => e.target.style.borderColor = 'hsl(220 20% 85%)'} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button type="submit"
          className="flex items-center gap-2 px-6 py-2.5 rounded text-sm font-semibold text-white transition-all"
          style={{ background: 'hsl(210 80% 48%)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'hsl(210 80% 42%)'}
          onMouseLeave={e => e.currentTarget.style.background = 'hsl(210 80% 48%)'}>
          <Icon name="Send" size={14} />
          Отправить запрос
        </button>
        <button type="button" onClick={onCancel}
          className="px-5 py-2.5 rounded text-sm font-medium transition-all"
          style={{ background: 'hsl(220 15% 92%)', color: 'hsl(220 30% 30%)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'hsl(220 15% 88%)'}
          onMouseLeave={e => e.currentTarget.style.background = 'hsl(220 15% 92%)'}>
          Отмена
        </button>
      </div>
    </form>
  );
}

export default function OfficerDashboard({ currentUser, requests, activeSection, onCreateRequest, onViewRequest }: OfficerDashboardProps) {
  const [showForm, setShowForm] = useState(false);
  const myRequests = requests.filter(r => r.authorId === currentUser.id);
  const activeRequests = myRequests.filter(r => r.status === 'new' || r.status === 'in_progress');
  const closedRequests = myRequests.filter(r => r.status === 'done' || r.status === 'rejected');

  if (showForm) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setShowForm(false)} className="p-1.5 rounded transition-all" style={{ color: 'hsl(220 15% 55%)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'hsl(220 15% 92%)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Icon name="ArrowLeft" size={16} />
          </button>
          <h1 className="text-xl font-bold" style={{ color: 'hsl(220 30% 15%)' }}>Новый запрос</h1>
        </div>
        <NewRequestForm currentUser={currentUser} onSubmit={data => { onCreateRequest(data); setShowForm(false); }} onCancel={() => setShowForm(false)} />
      </div>
    );
  }

  if (activeSection === 'dashboard') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold mb-1" style={{ color: 'hsl(220 30% 15%)' }}>Личный кабинет</h1>
            <p className="text-sm" style={{ color: 'hsl(220 15% 55%)' }}>{currentUser.rank} · {currentUser.department}</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded text-sm font-semibold text-white transition-all"
            style={{ background: 'hsl(210 80% 48%)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'hsl(210 80% 42%)'}
            onMouseLeave={e => e.currentTarget.style.background = 'hsl(210 80% 48%)'}>
            <Icon name="PlusCircle" size={15} />
            Создать запрос
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Всего запросов', value: myRequests.length, color: 'hsl(210 80% 48%)', icon: 'FileText' },
            { label: 'В обработке', value: activeRequests.length, color: 'hsl(38 90% 52%)', icon: 'Clock' },
            { label: 'Завершено', value: closedRequests.length, color: 'hsl(142 65% 38%)', icon: 'CheckCircle' },
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

        {activeRequests.length > 0 && (
          <div className="bg-white rounded-lg p-5" style={{ border: '1px solid hsl(220 20% 88%)' }}>
            <h3 className="font-semibold text-sm mb-3" style={{ color: 'hsl(220 30% 15%)' }}>Запросы в обработке</h3>
            <div className="space-y-2">
              {activeRequests.map(r => (
                <div key={r.id} onClick={() => onViewRequest(r)}
                  className="flex items-center gap-3 p-3 rounded cursor-pointer transition-all"
                  style={{ background: 'hsl(220 15% 97%)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'hsl(220 15% 93%)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'hsl(220 15% 97%)'}>
                  <RequestTypeBadge type={r.type} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium" style={{ color: 'hsl(220 30% 20%)' }}>{r.lastName} {r.firstName} {r.middleName}</div>
                    {r.assignedInspectorName && (
                      <div className="text-xs mt-0.5" style={{ color: 'hsl(220 15% 55%)' }}>Инспектор: {r.assignedInspectorName}</div>
                    )}
                  </div>
                  <RequestStatusBadge status={r.status} />
                </div>
              ))}
            </div>
          </div>
        )}

        {myRequests.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg" style={{ border: '1px solid hsl(220 20% 88%)' }}>
            <Icon name="FileSearch" size={48} className="mx-auto mb-3 opacity-20" style={{ color: 'hsl(210 80% 48%)' }} />
            <div className="font-medium mb-1" style={{ color: 'hsl(220 30% 25%)' }}>Запросов ещё нет</div>
            <div className="text-sm mb-4" style={{ color: 'hsl(220 15% 55%)' }}>Создайте первый запрос о пропавшем человеке</div>
            <button onClick={() => setShowForm(true)}
              className="px-4 py-2 rounded text-sm font-medium text-white"
              style={{ background: 'hsl(210 80% 48%)' }}>
              Создать запрос
            </button>
          </div>
        )}
      </div>
    );
  }

  if (activeSection === 'new_request') {
    return (
      <div className="space-y-4 animate-fade-in">
        <h1 className="text-xl font-bold" style={{ color: 'hsl(220 30% 15%)' }}>Новый запрос</h1>
        <NewRequestForm currentUser={currentUser} onSubmit={data => { onCreateRequest(data); }} onCancel={() => {}} />
      </div>
    );
  }

  if (activeSection === 'my_requests') {
    return (
      <div className="space-y-4 animate-fade-in">
        <h1 className="text-xl font-bold" style={{ color: 'hsl(220 30% 15%)' }}>Мои запросы</h1>
        {myRequests.length === 0 ? (
          <div className="text-center py-12 text-sm" style={{ color: 'hsl(220 15% 55%)' }}>Вы ещё не создавали запросов</div>
        ) : (
          <div className="bg-white rounded-lg overflow-hidden" style={{ border: '1px solid hsl(220 20% 88%)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'hsl(220 15% 97%)', borderBottom: '1px solid hsl(220 20% 91%)' }}>
                  {['Гражданин', 'Тип', 'Статус', 'Инспектор', 'Обновлено', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'hsl(220 15% 50%)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myRequests.map((r, i) => (
                  <tr key={r.id}
                    onClick={() => onViewRequest(r)}
                    className="cursor-pointer transition-all"
                    style={{ borderBottom: i < myRequests.length - 1 ? '1px solid hsl(220 20% 93%)' : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'hsl(220 15% 98%)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td className="px-4 py-3 font-medium" style={{ color: 'hsl(220 30% 20%)' }}>{r.lastName} {r.firstName} {r.middleName}</td>
                    <td className="px-4 py-3"><RequestTypeBadge type={r.type} /></td>
                    <td className="px-4 py-3"><RequestStatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'hsl(220 15% 50%)' }}>{r.assignedInspectorName || '—'}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'hsl(220 15% 50%)' }}>{formatDate(r.updatedAt)}</td>
                    <td className="px-4 py-3"><Icon name="ChevronRight" size={14} style={{ color: 'hsl(220 15% 60%)' }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  if (activeSection === 'history') {
    return (
      <div className="space-y-4 animate-fade-in">
        <h1 className="text-xl font-bold" style={{ color: 'hsl(220 30% 15%)' }}>История запросов</h1>
        <div className="space-y-3">
          {closedRequests.length === 0 ? (
            <div className="text-center py-12 text-sm" style={{ color: 'hsl(220 15% 55%)' }}>Завершённых запросов нет</div>
          ) : closedRequests.map(r => (
            <div key={r.id} onClick={() => onViewRequest(r)}
              className="bg-white rounded-lg p-4 cursor-pointer transition-all"
              style={{ border: '1px solid hsl(220 20% 88%)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'hsl(220 15% 98%)'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}>
              <div className="flex items-center gap-2 mb-1">
                <RequestTypeBadge type={r.type} />
                <RequestStatusBadge status={r.status} />
              </div>
              <div className="font-medium mt-1" style={{ color: 'hsl(220 30% 15%)' }}>{r.lastName} {r.firstName} {r.middleName}</div>
              <div className="text-xs mt-1" style={{ color: 'hsl(220 15% 55%)' }}>
                Закрыто: {formatDate(r.updatedAt)} · Инспектор: {r.assignedInspectorName || '—'}
              </div>
              {r.comments.filter(c => c.status === 'done' && c.extendedText).map(c => (
                <div key={c.id} className="mt-2 p-2 rounded text-sm" style={{ background: 'hsl(142 65% 38% / 0.06)', borderLeft: '3px solid hsl(142 65% 38%)', color: 'hsl(220 30% 25%)' }}>
                  {c.extendedText}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}