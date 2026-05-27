import { useState } from 'react';
import { User } from '@/types';
import Icon from '@/components/ui/icon';

interface LayoutProps {
  currentUser: User;
  onLogout: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  children: React.ReactNode;
}

const NAV_BY_ROLE = {
  admin: [
    { section: 'dashboard', label: 'Главная', icon: 'LayoutDashboard' },
    { section: 'requests', label: 'Все запросы', icon: 'FileSearch' },
    { section: 'history', label: 'История', icon: 'History' },
    { section: 'users', label: 'Пользователи', icon: 'Users' },
    { section: 'reports', label: 'Отчёты', icon: 'BarChart2' },
    { section: 'logs', label: 'Логирование', icon: 'Terminal' },
    { section: 'settings', label: 'Настройки', icon: 'Settings' },
  ],
  inspector: [
    { section: 'dashboard', label: 'Главная', icon: 'LayoutDashboard' },
    { section: 'requests', label: 'Входящие запросы', icon: 'Inbox' },
    { section: 'my_work', label: 'Мои дела', icon: 'Briefcase' },
    { section: 'history', label: 'История', icon: 'History' },
    { section: 'reports', label: 'Отчёты', icon: 'BarChart2' },
  ],
  officer: [
    { section: 'dashboard', label: 'Главная', icon: 'LayoutDashboard' },
    { section: 'new_request', label: 'Новый запрос', icon: 'PlusCircle' },
    { section: 'my_requests', label: 'Мои запросы', icon: 'FileText' },
    { section: 'history', label: 'История', icon: 'History' },
  ],
};

const ROLE_LABELS: Record<string, string> = {
  admin: 'Администратор',
  inspector: 'Инспектор БРНС',
  officer: 'Сотрудник ПОО',
};

const ROLE_COLORS: Record<string, string> = {
  admin: 'hsl(0 72% 51%)',
  inspector: 'hsl(210 80% 48%)',
  officer: 'hsl(142 65% 38%)',
};

export default function Layout({ currentUser, onLogout, activeSection, onSectionChange, children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navItems = NAV_BY_ROLE[currentUser.role];

  return (
    <div className="min-h-screen flex" style={{ background: 'hsl(220 20% 97%)' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col transition-all duration-200 flex-shrink-0"
        style={{
          width: sidebarOpen ? '240px' : '60px',
          background: 'hsl(220 65% 22%)',
          borderRight: '1px solid hsl(220 50% 28%)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 py-4" style={{ borderBottom: '1px solid hsl(220 50% 28%)' }}>
          <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: 'hsl(210 80% 48%)' }}>
            <Icon name="Shield" size={18} className="text-white" />
          </div>
          {sidebarOpen && (
            <div className="animate-fade-in overflow-hidden">
              <div className="text-white font-semibold text-xs leading-tight whitespace-nowrap">БРНС</div>
              <div className="text-xs whitespace-nowrap" style={{ color: 'hsl(210 40% 55%)' }}>Орловская область</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.section}
              onClick={() => onSectionChange(item.section)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-all duration-150 ${activeSection === item.section ? 'active' : ''}`}
              style={{
                color: activeSection === item.section ? 'hsl(210 80% 75%)' : 'hsl(210 40% 70%)',
                background: activeSection === item.section ? 'hsl(210 80% 48% / 0.2)' : 'transparent',
                borderLeft: activeSection === item.section ? '3px solid hsl(210 80% 55%)' : '3px solid transparent',
                textAlign: 'left',
              }}
              onMouseEnter={e => {
                if (activeSection !== item.section) {
                  e.currentTarget.style.background = 'hsl(220 55% 30%)';
                  e.currentTarget.style.color = 'hsl(210 40% 90%)';
                }
              }}
              onMouseLeave={e => {
                if (activeSection !== item.section) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'hsl(210 40% 70%)';
                }
              }}
            >
              <Icon name={item.icon} fallback="Circle" size={16} className="flex-shrink-0" />
              {sidebarOpen && <span className="animate-fade-in whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User info */}
        <div className="p-3" style={{ borderTop: '1px solid hsl(220 50% 28%)' }}>
          {sidebarOpen ? (
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: ROLE_COLORS[currentUser.role] }}>
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-medium text-white truncate leading-tight">
                    {currentUser.fullName.split(' ')[0]} {currentUser.fullName.split(' ')[1]}
                  </div>
                  <div className="text-xs truncate" style={{ color: 'hsl(210 40% 55%)' }}>
                    {ROLE_LABELS[currentUser.role]}
                  </div>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-all"
                style={{ color: 'hsl(210 40% 55%)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'hsl(0 72% 51% / 0.15)'; e.currentTarget.style.color = 'hsl(0 72% 70%)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'hsl(210 40% 55%)'; }}
              >
                <Icon name="LogOut" size={13} />
                Выйти
              </button>
            </div>
          ) : (
            <button
              onClick={onLogout}
              className="w-full flex justify-center p-1.5 rounded transition-all"
              style={{ color: 'hsl(210 40% 55%)' }}
              title="Выйти"
              onMouseEnter={e => { e.currentTarget.style.background = 'hsl(0 72% 51% / 0.15)'; e.currentTarget.style.color = 'hsl(0 72% 70%)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'hsl(210 40% 55%)'; }}
            >
              <Icon name="LogOut" size={15} />
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center gap-4 px-6 py-3 bg-white"
          style={{ borderBottom: '1px solid hsl(220 20% 88%)' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded transition-all"
            style={{ color: 'hsl(220 30% 50%)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'hsl(220 15% 94%)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Icon name={sidebarOpen ? 'PanelLeftClose' : 'PanelLeftOpen'} size={18} />
          </button>

          <div className="flex-1">
            <h2 className="text-sm font-semibold" style={{ color: 'hsl(220 30% 20%)' }}>
              {navItems.find(n => n.section === activeSection)?.label || 'Личный кабинет'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-medium" style={{ color: 'hsl(220 30% 25%)' }}>
                {currentUser.fullName}
              </div>
              <div className="text-xs" style={{ color: 'hsl(220 15% 55%)' }}>
                {currentUser.department}
              </div>
            </div>
            <div className="px-2 py-0.5 rounded text-xs font-medium text-white"
              style={{ background: ROLE_COLORS[currentUser.role] }}>
              {ROLE_LABELS[currentUser.role]}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
