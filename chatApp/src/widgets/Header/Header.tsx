import { Link } from 'react-router-dom';
import { Button } from 'antd';
import './Header.css';
import chatLogo from '../../assets/chat-logo-nobg.png';
import { HomeOutlined, MessageFilled, SettingFilled } from '@ant-design/icons';

export function Header() {
  return (
    <header className="header">
      <div className="btn-nav">
        <nav>
          <Link to="/home">
            <Button icon={<HomeOutlined />} type="primary">
              Главная
            </Button>
          </Link>
        </nav>
      </div>

      <div className="notification-icon">
        <MessageFilled />
        <SettingFilled />
      </div>

      <div className="logo-title">
        <img src={chatLogo} alt="chat-logo" className="chat-logo-jpeg" />
        <h2>[Trial version]</h2>
      </div>
    </header>
  );
}
