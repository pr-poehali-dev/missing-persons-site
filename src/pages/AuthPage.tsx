import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface AuthPageProps {
  onLogin: (login: string, password: string) => { success: boolean; error?: string };
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login || !password) {
      setError('Введите логин и пароль');
      return;
    }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 400));
    const result = onLogin(login, password);
    if (!result.success) {
      setError(result.error || 'Ошибка авторизации');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'hsl(220 65% 22%)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] p-10 relative overflow-hidden"
        style={{ background: 'hsl(220 65% 18%)' }}>
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px)',
          }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded flex items-center justify-center"
              style={{ background: 'hsl(210 80% 48%)' }}>
              <Icon name="Shield" size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm leading-tight">БРНС</div>
              <div className="text-xs" style={{ color: 'hsl(210 40% 65%)' }}>Орловская область</div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white leading-tight mb-3">
            ИС "БРНС" ОРОО<br />"ПСО "САРМАТ"
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'hsl(210 40% 65%)' }}>
            Автоматизированная система обработки запросов о розыске пропавших людей и установлении статуса военнослужащих
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          {[
            { icon: 'Search', text: 'Поиск в медицинских учреждениях' },
            { icon: 'Star', text: 'Статус военнослужащих' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: 'hsl(210 80% 48% / 0.2)' }}>
                <Icon name={item.icon} fallback="Circle" size={14} style={{ color: 'hsl(210 80% 65%)' }} />
              </div>
              <span className="text-sm" style={{ color: 'hsl(210 40% 70%)' }}>{item.text}</span>
            </div>
          ))}
        </div>

        <div className="relative z-10">
          <p className="text-xs" style={{ color: 'hsl(210 40% 45%)' }}>
            © 2026 ИС "БРНС" ОРОО "ПСО "САРМАТ".<br />Доступ разрешён только уполномоченным лицам.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded flex items-center justify-center"
              style={{ background: 'hsl(210 80% 48%)' }}>
              <Icon name="Shield" size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">БРНС Орловской области</div>
            </div>
          </div>

          <div className="rounded-lg p-8" style={{ background: 'hsl(220 65% 26%)' }}>
            <h2 className="text-xl font-semibold text-white mb-1">Вход в систему</h2>
            <p className="text-sm mb-6" style={{ color: 'hsl(210 40% 60%)' }}>
              Введите ваши учётные данные
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(210 40% 70%)' }}>
                  Логин
                </label>
                <input
                  type="text"
                  value={login}
                  onChange={e => setLogin(e.target.value)}
                  placeholder="Введите логин"
                  autoComplete="username"
                  className="w-full px-3 py-2.5 rounded text-sm text-white placeholder-opacity-50 outline-none transition-all"
                  style={{
                    background: 'hsl(220 65% 20%)',
                    border: '1px solid hsl(220 50% 35%)',
                    color: 'hsl(210 40% 90%)',
                  }}
                  onFocus={e => e.target.style.borderColor = 'hsl(210 80% 55%)'}
                  onBlur={e => e.target.style.borderColor = 'hsl(220 50% 35%)'}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(210 40% 70%)' }}>
                  Пароль
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Введите пароль"
                    autoComplete="current-password"
                    className="w-full px-3 py-2.5 pr-10 rounded text-sm outline-none transition-all"
                    style={{
                      background: 'hsl(220 65% 20%)',
                      border: '1px solid hsl(220 50% 35%)',
                      color: 'hsl(210 40% 90%)',
                    }}
                    onFocus={e => e.target.style.borderColor = 'hsl(210 80% 55%)'}
                    onBlur={e => e.target.style.borderColor = 'hsl(220 50% 35%)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-80"
                    style={{ color: 'hsl(210 40% 55%)' }}
                  >
                    <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2 rounded text-sm animate-fade-in"
                  style={{ background: 'hsl(0 72% 51% / 0.15)', color: 'hsl(0 72% 70%)', border: '1px solid hsl(0 72% 51% / 0.3)' }}>
                  <Icon name="AlertCircle" size={14} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded text-sm font-semibold text-white transition-all mt-2"
                style={{
                  background: loading ? 'hsl(210 80% 38%)' : 'hsl(210 80% 48%)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={e => !loading && ((e.target as HTMLElement).style.background = 'hsl(210 80% 55%)')}
                onMouseLeave={e => !loading && ((e.target as HTMLElement).style.background = 'hsl(210 80% 48%)')}
              >
                {loading ? 'Проверка...' : 'Войти в систему'}
              </button>
            </form>

            <div className="mt-6 pt-5" style={{ borderTop: '1px solid hsl(220 50% 30%)' }}>
              <p className="text-xs mb-3" style={{ color: 'hsl(210 40% 45%)' }}>Тестовые учётные записи:</p>
              <div className="space-y-1.5">
                {[
                  { role: 'Администратор', login: 'admin', pass: 'admin123' },
                  { role: 'Инспектор БРНС', login: 'inspector1', pass: 'insp123' },
                  { role: 'Сотрудник ПОО', login: 'officer1', pass: 'off123' },
                ].map(acc => (
                  <button
                    key={acc.login}
                    onClick={() => { setLogin(acc.login); setPassword(acc.pass); setError(''); }}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded text-xs transition-all"
                    style={{ background: 'hsl(220 65% 20%)', color: 'hsl(210 40% 65%)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'hsl(220 65% 23%)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'hsl(220 65% 20%)')}
                  >
                    <span>{acc.role}</span>
                    <span style={{ color: 'hsl(210 40% 45%)' }}>{acc.login}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}