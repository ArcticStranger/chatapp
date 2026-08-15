import { Button, Input } from 'antd';
import {
  CopyOutlined,
  ThunderboltFilled,
  TeamOutlined,
  LinkOutlined,
  RocketFilled,
} from '@ant-design/icons';
import './HomePage.css';
import { Link } from 'react-router-dom';
import useHomePage from '../model/useHomePage';

const FEATURES = [
  {
    icon: ThunderboltFilled,
    title: 'Реальное время',
    text: 'Сообщения доставляются мгновенно через Socket.IO без перезагрузки страницы.',
  },
  {
    icon: LinkOutlined,
    title: 'Приглашения по ссылке',
    text: 'Создайте комнату и отправьте ссылку — собеседники подключатся в один клик.',
  },
  {
    icon: TeamOutlined,
    title: 'Совместные комнаты',
    text: 'Общайтесь сразу с несколькими участниками в одной беседе.',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Создайте комнату',
    text: 'Задайте название и выберите число участников.',
  },
  {
    number: '02',
    title: 'Поделитесь ссылкой',
    text: 'Отправьте приглашение друзьям или коллегам.',
  },
  { number: '03', title: 'Общайтесь', text: 'Обменивайтесь сообщениями в реальном времени.' },
];

export function HomePage() {
  const model = useHomePage();
  return (
    <main className="home-page">
      <section className="home-hero">
        <span className="home-badge">Быстро · Просто · Бесплатно</span>
        <h1 className="home-title">Добро пожаловать в chatApp</h1>

        <p className="home-description">
          Общайтесь в реальном времени: создавайте комнаты, делитесь ссылками-приглашениями и
          продолжайте переписку с собеседниками.
        </p>

        <div className="invite-link">
          <Input
            value={model.inviteLink}
            onChange={(event) => model.setInviteLink(event.target.value)}
            placeholder="Вставьте ссылку на комнату"
            size="large"
          />

          <Button
            icon={<CopyOutlined />}
            onClick={model.handlePasteLink}
            size="large"
            type="primary"
          >
            Вставить
          </Button>
        </div>

        {model.pasteError && <p className="invite-link-error">{model.pasteError}</p>}

        <div className="home-hero-actions">
          <Link to="/room">
            <Button icon={<RocketFilled />} size="large">
              Создать комнату
            </Button>
          </Link>
        </div>
      </section>

      <section className="home-section" aria-label="Возможности">
        <h2 className="home-section-title">Возможности</h2>
        <div className="home-features">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <article className="home-feature" key={feature.title}>
                <span className="home-feature-icon">
                  <Icon />
                </span>
                <h3 className="home-feature-title">{feature.title}</h3>
                <p className="home-feature-text">{feature.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="home-section" aria-label="Как это работает">
        <h2 className="home-section-title">Как это работает</h2>
        <div className="home-steps">
          {STEPS.map((step) => (
            <article className="home-step" key={step.number}>
              <span className="home-step-number">{step.number}</span>
              <h3 className="home-step-title">{step.title}</h3>
              <p className="home-step-text">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-actions" aria-label="Действия с чатами">
        <Link to="/room" className="home-action home-action-create">
          <span className="home-action-title">Создать комнату чата</span>
          <span className="home-action-text">
            Начните новый разговор и отправьте приглашение собеседникам.
          </span>
        </Link>
        <button
          className="home-action home-action-list"
          type="button"
          onClick={() => console.log('room list clicked')}
        >
          <span className="home-action-title">Открыть список чатов</span>
          <span className="home-action-text">
            Вернитесь к уже созданным комнатам и продолжите переписку.
          </span>
        </button>
      </section>
    </main>
  );
}
