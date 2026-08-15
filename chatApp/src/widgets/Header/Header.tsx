import { NavLink } from 'react-router-dom';
import { HomeOutlined, PlusOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';
import './Header.css';

const NAV_ITEMS = [
  { to: '/home', label: 'Главная', icon: HomeOutlined, end: true },
  { to: '/room', label: 'Создать комнату', icon: PlusOutlined },
];

export function Header() {
  return (
    <header className="header">
      <div className="header-brand">
        <span className="header-brand-dot" />
        chatApp
      </div>

      <nav className="header-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `header-tab ${isActive ? 'header-tab--active' : ''}`}
            >
              <Icon />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="header-actions">
        <button type="button" className="header-icon-btn" aria-label="Сообщения">
          <MessageOutlined />
        </button>
        <button type="button" className="header-icon-btn" aria-label="Настройки">
          <SettingOutlined />
        </button>
      </div>
    </header>
  );
}
