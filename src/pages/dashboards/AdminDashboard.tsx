import { MissingRequest, User, LogEntry } from '@/types';
import Icon from '@/components/ui/icon';
import RequestStatusBadge from '@/components/RequestStatusBadge';
import RequestTypeBadge from '@/components/RequestTypeBadge';

interface AdminDashboardProps {
  requests: MissingRequest[];
  users: User[];
  logs: LogEntry[];
  activeSection: string;
  onSectionChange: (s: string) => void;
  onToggleUser: (id: string) => Promise<void>;
  onDeleteUser: (id: string) => Promise<void>;
  onAddUser: (data: Omit<User, 'id' | 'createdAt'>) => Promise<{ success: boolean; error?: string; user?: User }>;
  onViewRequest: (req: MissingRequest) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number | string; color: string }) {
  return (
    <div className="bg-white rounded-lg p-5 flex items-center gap-4 animate-fade-in"
      style={{ border: '1px solid hsl(220 20% 88%)' }}>
      <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18` }}>
        <Icon name={icon} fallback="Circle" size={22} style={{ color }} />
      </div>
      <div>
        <div className="text-2xl font-bold" style={{ color: 'hsl(220 30% 15%)' }}>{value}</div>
        <div className="text-xs" style={{ color: 'hsl(220 15% 55%)' }}>{label}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard({
  requests, users, logs, activeSection, onSectionChange,
  onToggleUser, onDeleteUser, onAddUser, onViewRequest,
}: AdminDashboardProps) {
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ fullName: '', login: '', password: '', role: 'officer' as User['role'], department: '', rank: '' });
  const [addUserError, setAddUserError] = useState('');
  const [addUserLoading, setAddUserLoading] = useState(false);

  const stats = {
    total: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
    done: requests.filter(r => r.status === 'done').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  const handleAddUser = async () => {
    if (!newUser.fullName || !newUser.login || !newUser.password || !newUser.department) {
      setAddUserError('Заполните все обязательные поля');
      return;
    }
    setAddUserLoading(true);
    setAddUserError('');
    const result = await onAddUser({ ...newUser, isActive: true });
    setAddUserLoading(false);
    if (!result.success) {
      setAddUserError(result.error || 'Ошибка при создании пользователя');
      return;
    }
    setNewUser({ fullName: '', login: '', password: '', role: 'officer', department: '', rank: '' });
    setShowAddUser(false);
  };

  if (activeSection === 'dashboard') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl font-bold mb-1" style={{ color: 'hsl(220 30% 15%)' }}>Панель управления</h1>
          <p className="text-sm" style={{ color: 'hsl(220 15% 55%)' }}>Обзор системы БРНС Орловской области</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="FileText" label="Всего запросов" value={stats.total} color="hsl(220 65% 45%)" />
          <StatCard icon="Clock" label="Новые" value={stats.new} color="hsl(38 90% 52%)" />
          <StatCard icon="Loader" label="В работе" value={stats.inProgress} color="hsl(210 80% 48%)" />
          <StatCard icon="CheckCircle" label="Выполнено" value={stats.done} color="hsl(142 65% 38%)" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-5" style={{ border: '1px solid hsl(220 20% 88%)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'hsl(220 30% 15%)' }}>Последние запросы</h3>
              <button onClick={() => onSectionChange('requests')} className="text-xs" style={{ color: 'hsl(210 80% 48%)' }}>Все →</button>
            </div>
            <div className="space-y-2">
              {requests.slice(0, 5).map(r => (
                <div key={r.id} onClick={() => onViewRequest(r)}
                  className="flex items-center gap-3 p-2 rounded cursor-pointer transition-all"
                  onMouseEnter={e => e.currentTarget.style.background = 'hsl(220 15% 96%)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: 'hsl(220 30% 20%)' }}>
                      {r.lastName} {r.firstName} {r.middleName}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'hsl(220 15% 55%)' }}>{formatDate(r.createdAt)}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <RequestTypeBadge type={r.type} />
                    <RequestStatusBadge status={r.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-5" style={{ border: '1px solid hsl(220 20% 88%)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'hsl(220 30% 15%)' }}>Активность пользователей</h3>
              <button onClick={() => onSectionChange('logs')} className="text-xs" style={{ color: 'hsl(210 80% 48%)' }}>Журнал →</button>
            </div>
            <div className="space-y-2">
              {logs.slice(0, 6).map(l => (
                <div key={l.id} className="flex items-start gap-2 p-2 rounded" style={{ background: 'hsl(220 15% 97%)' }}>
                  <Icon name="Activity" size={13} className="mt-0.5 flex-shrink-0" style={{ color: 'hsl(210 80% 48%)' }} />
                  <div className="min-w-0">
                    <div className="text-xs font-medium" style={{ color: 'hsl(220 30% 25%)' }}>{l.action}</div>
                    <div className="text-xs truncate" style={{ color: 'hsl(220 15% 55%)' }}>{l.details}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'hsl(220 15% 65%)' }}>{l.userName} · {formatDate(l.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5" style={{ border: '1px solid hsl(220 20% 88%)' }}>
          <h3 className="font-semibold text-sm mb-4" style={{ color: 'hsl(220 30% 15%)' }}>Пользователи системы</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {users.map(u => (
              <div key={u.id} className="flex items-center gap-3 p-3 rounded" style={{ background: 'hsl(220 15% 97%)', border: '1px solid hsl(220 20% 91%)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: u.role === 'admin' ? 'hsl(0 72% 51%)' : u.role === 'inspector' ? 'hsl(210 80% 48%)' : 'hsl(142 65% 38%)' }}>
                  {u.fullName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium truncate" style={{ color: 'hsl(220 30% 20%)' }}>{u.fullName.split(' ')[1]} {u.fullName.split(' ')[0].charAt(0)}.</div>
                  <div className="text-xs truncate" style={{ color: u.isActive ? 'hsl(142 65% 38%)' : 'hsl(0 72% 51%)' }}>{u.isActive ? 'Активен' : 'Заблокирован'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'requests' || activeSection === 'history') {
    const filtered = activeSection === 'history' ? requests.filter(r => r.status === 'done' || r.status === 'rejected') : requests;
    return (
      <div className="space-y-4 animate-fade-in">
        <h1 className="text-xl font-bold" style={{ color: 'hsl(220 30% 15%)' }}>
          {activeSection === 'history' ? 'История запросов' : 'Все запросы'}
        </h1>
        <RequestsTable requests={filtered} onView={onViewRequest} />
      </div>
    );
  }

  if (activeSection === 'users') {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold" style={{ color: 'hsl(220 30% 15%)' }}>Пользователи</h1>
          <button onClick={() => setShowAddUser(true)}
            className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium text-white transition-all"
            style={{ background: 'hsl(210 80% 48%)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'hsl(210 80% 42%)'}
            onMouseLeave={e => e.currentTarget.style.background = 'hsl(210 80% 48%)'}>
            <Icon name="UserPlus" size={15} />
            Добавить пользователя
          </button>
        </div>

        {showAddUser && (
          <div className="bg-white rounded-lg p-5 animate-fade-in" style={{ border: '1px solid hsl(220 20% 88%)' }}>
            <h3 className="font-semibold mb-4" style={{ color: 'hsl(220 30% 15%)' }}>Новый пользователь</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {[
                { key: 'fullName', label: 'ФИО', placeholder: 'Иванов Иван Иванович' },
                { key: 'login', label: 'Логин', placeholder: 'ivanov_i' },
                { key: 'password', label: 'Пароль', placeholder: '••••••••' },
                { key: 'department', label: 'Подразделение', placeholder: 'МВД России по Орловской области' },
                { key: 'rank', label: 'Звание/должность', placeholder: 'Майор полиции' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'hsl(220 15% 45%)' }}>{f.label}</label>
                  <input
                    value={(newUser as Record<string, string>)[f.key]}
                    onChange={e => setNewUser(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2 rounded text-sm outline-none transition-all"
                    style={{ border: '1px solid hsl(220 20% 85%)', background: 'hsl(220 15% 98%)' }}
                    onFocus={e => e.target.style.borderColor = 'hsl(210 80% 55%)'}
                    onBlur={e => e.target.style.borderColor = 'hsl(220 20% 85%)'}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'hsl(220 15% 45%)' }}>Роль</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser(p => ({ ...p, role: e.target.value as User['role'] }))}
                  className="w-full px-3 py-2 rounded text-sm outline-none"
                  style={{ border: '1px solid hsl(220 20% 85%)', background: 'hsl(220 15% 98%)' }}>
                  <option value="officer">Сотрудник ПОО</option>
                  <option value="inspector">Инспектор БРНС</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>
            </div>
            {addUserError && (
              <div className="mb-3 px-3 py-2 rounded text-sm" style={{ background: 'hsl(0 72% 51% / 0.1)', color: 'hsl(0 72% 45%)', border: '1px solid hsl(0 72% 51% / 0.3)' }}>
                {addUserError}
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={handleAddUser} disabled={addUserLoading}
                className="px-4 py-2 rounded text-sm font-medium text-white"
                style={{ background: addUserLoading ? 'hsl(210 80% 65%)' : 'hsl(210 80% 48%)', cursor: addUserLoading ? 'not-allowed' : 'pointer' }}>
                {addUserLoading ? 'Сохранение...' : 'Создать'}
              </button>
              <button onClick={() => { setShowAddUser(false); setAddUserError(''); }}
                className="px-4 py-2 rounded text-sm font-medium"
                style={{ background: 'hsl(220 15% 92%)', color: 'hsl(220 30% 30%)' }}>
                Отмена
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg overflow-hidden" style={{ border: '1px solid hsl(220 20% 88%)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'hsl(220 15% 97%)', borderBottom: '1px solid hsl(220 20% 91%)' }}>
                {['ФИО', 'Логин', 'Роль', 'Подразделение', 'Статус', 'Действия'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'hsl(220 15% 50%)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid hsl(220 20% 93%)' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'hsl(220 15% 98%)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'hsl(220 30% 20%)' }}>{u.fullName}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'hsl(220 15% 45%)' }}>{u.login}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded font-medium text-white"
                      style={{ background: u.role === 'admin' ? 'hsl(0 72% 51%)' : u.role === 'inspector' ? 'hsl(210 80% 48%)' : 'hsl(142 65% 38%)' }}>
                      {u.role === 'admin' ? 'Администратор' : u.role === 'inspector' ? 'Инспектор' : 'Сотрудник ПОО'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'hsl(220 15% 45%)' }}>{u.department}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${u.isActive ? 'status-badge-done' : 'status-badge-rejected'}`}>
                      {u.isActive ? 'Активен' : 'Заблокирован'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => onToggleUser(u.id)}
                        className="p-1.5 rounded transition-all text-xs"
                        style={{ color: u.isActive ? 'hsl(38 90% 45%)' : 'hsl(142 65% 38%)' }}
                        title={u.isActive ? 'Заблокировать' : 'Активировать'}
                        onMouseEnter={e => e.currentTarget.style.background = 'hsl(220 15% 92%)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <Icon name={u.isActive ? 'UserX' : 'UserCheck'} size={14} />
                      </button>
                      <button onClick={() => onDeleteUser(u.id)}
                        className="p-1.5 rounded transition-all"
                        style={{ color: 'hsl(0 72% 51%)' }}
                        title="Удалить"
                        onMouseEnter={e => e.currentTarget.style.background = 'hsl(220 15% 92%)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeSection === 'logs') {
    return (
      <div className="space-y-4 animate-fade-in">
        <h1 className="text-xl font-bold" style={{ color: 'hsl(220 30% 15%)' }}>Журнал событий</h1>
        <div className="bg-white rounded-lg overflow-hidden" style={{ border: '1px solid hsl(220 20% 88%)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'hsl(220 15% 97%)', borderBottom: '1px solid hsl(220 20% 91%)' }}>
                {['Дата', 'Пользователь', 'Действие', 'Детали'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'hsl(220 15% 50%)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((l, i) => (
                <tr key={l.id} style={{ borderBottom: i < logs.length - 1 ? '1px solid hsl(220 20% 93%)' : 'none' }}>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'hsl(220 15% 50%)' }}>{formatDate(l.createdAt)}</td>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: 'hsl(220 30% 25%)' }}>{l.userName}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'hsl(210 80% 42%)' }}>{l.action}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'hsl(220 15% 45%)' }}>{l.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeSection === 'reports') {
    const medical = requests.filter(r => r.type === 'medical').length;
    const military = requests.filter(r => r.type === 'military').length;
    return (
      <div className="space-y-4 animate-fade-in">
        <h1 className="text-xl font-bold" style={{ color: 'hsl(220 30% 15%)' }}>Отчёты</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="FileSearch" label="Медицинские запросы" value={medical} color="hsl(280 60% 50%)" />
          <StatCard icon="Star" label="Военные запросы" value={military} color="hsl(30 80% 50%)" />
          <StatCard icon="Users" label="Пользователей в системе" value={users.length} color="hsl(210 80% 48%)" />
          <StatCard icon="TrendingUp" label="Завершено в этом месяце" value={stats.done} color="hsl(142 65% 38%)" />
        </div>
        <div className="bg-white rounded-lg p-6" style={{ border: '1px solid hsl(220 20% 88%)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'hsl(220 30% 15%)' }}>Распределение по статусам</h3>
          {([
            { label: 'Новые', count: stats.new, color: 'hsl(38 90% 52%)', total: stats.total },
            { label: 'В работе', count: stats.inProgress, color: 'hsl(210 80% 48%)', total: stats.total },
            { label: 'Выполнено', count: stats.done, color: 'hsl(142 65% 38%)', total: stats.total },
            { label: 'Отклонено', count: stats.rejected, color: 'hsl(0 72% 51%)', total: stats.total },
          ] as const).map(item => (
            <div key={item.label} className="mb-3">
              <div className="flex justify-between text-xs mb-1" style={{ color: 'hsl(220 15% 45%)' }}>
                <span>{item.label}</span>
                <span>{item.count} из {item.total}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'hsl(220 15% 92%)' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.total ? (item.count / item.total) * 100 : 0}%`, background: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeSection === 'settings') {
    return (
      <div className="space-y-4 animate-fade-in">
        <h1 className="text-xl font-bold" style={{ color: 'hsl(220 30% 15%)' }}>Настройки системы</h1>
        <div className="bg-white rounded-lg p-6" style={{ border: '1px solid hsl(220 20% 88%)' }}>
          <div className="space-y-4">
            {[
              { label: 'Наименование системы', value: 'БРНС Орловской области' },
              { label: 'Версия', value: '1.0.0' },
              { label: 'Регион', value: 'Орловская область' },
              { label: 'Контактный email', value: 'brns@orel.gov.ru' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-4 pb-3" style={{ borderBottom: '1px solid hsl(220 20% 93%)' }}>
                <div className="w-48 text-sm font-medium" style={{ color: 'hsl(220 15% 45%)' }}>{item.label}</div>
                <div className="text-sm" style={{ color: 'hsl(220 30% 20%)' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function RequestsTable({ requests, onView }: { requests: MissingRequest[]; onView: (r: MissingRequest) => void }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden" style={{ border: '1px solid hsl(220 20% 88%)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'hsl(220 15% 97%)', borderBottom: '1px solid hsl(220 20% 91%)' }}>
            {['Гражданин', 'Тип', 'Статус', 'Инспектор', 'Дата создания', ''].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'hsl(220 15% 50%)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 && (
            <tr><td colSpan={6} className="px-4 py-8 text-center text-sm" style={{ color: 'hsl(220 15% 55%)' }}>Запросы не найдены</td></tr>
          )}
          {requests.map((r, i) => (
            <tr key={r.id}
              onClick={() => onView(r)}
              className="cursor-pointer transition-all"
              style={{ borderBottom: i < requests.length - 1 ? '1px solid hsl(220 20% 93%)' : 'none' }}
              onMouseEnter={e => e.currentTarget.style.background = 'hsl(220 15% 98%)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <td className="px-4 py-3">
                <div className="font-medium" style={{ color: 'hsl(220 30% 20%)' }}>{r.lastName} {r.firstName} {r.middleName}</div>
                <div className="text-xs mt-0.5" style={{ color: 'hsl(220 15% 55%)' }}>{r.authorDepartment}</div>
              </td>
              <td className="px-4 py-3"><RequestTypeBadge type={r.type} /></td>
              <td className="px-4 py-3"><RequestStatusBadge status={r.status} /></td>
              <td className="px-4 py-3 text-xs" style={{ color: 'hsl(220 15% 50%)' }}>{r.assignedInspectorName || '—'}</td>
              <td className="px-4 py-3 text-xs" style={{ color: 'hsl(220 15% 50%)' }}>{new Date(r.createdAt).toLocaleDateString('ru-RU')}</td>
              <td className="px-4 py-3"><Icon name="ChevronRight" size={14} style={{ color: 'hsl(220 15% 60%)' }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Need useState for AdminDashboard
import { useState } from 'react';