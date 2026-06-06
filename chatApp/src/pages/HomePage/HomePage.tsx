import { useState } from 'react';
import { Button, Input } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import './HomePage.css';

export function HomePage() {
  const [inviteLink, setInviteLink] = useState('');
  const [pasteError, setPasteError] = useState('');

  const handlePasteLink = async () => {
    setPasteError('');

    if (!navigator.clipboard?.readText) {
      setPasteError('Браузер не разрешил прочитать буфер обмена');
      return;
    }

    const clipboardText = await navigator.clipboard.readText();

    if (!clipboardText.trim()) {
      setPasteError('В буфере обмена пусто');
      return;
    }

    setInviteLink(clipboardText);
  };

  return (
    <main className="home-page">
      <h1 className="home-title">Мессенджер нездорового курильщика</h1>

      <p className="home-description">
        Быстрые комнаты, живые сообщения и минимум церемоний. Вставьте приглашение и залетайте в
        чат.
      </p>

      <div className="invite-link">
        <Input
          value={inviteLink}
          onChange={(event) => setInviteLink(event.target.value)}
          placeholder="Вставьте ссылку на комнату"
          size="large"
        />

        <Button icon={<CopyOutlined />} onClick={handlePasteLink} size="large" type="primary">
          Вставить
        </Button>
      </div>

      {pasteError && <p className="invite-link-error">{pasteError}</p>}

      <section className="home-actions" aria-label="Действия с чатами">
        <button className="home-action home-action-create" type="button">
          <span className="home-action-title">Создать комнату чата</span>
          <span className="home-action-text">
            Начните новый разговор и отправьте приглашение собеседникам.
          </span>
        </button>

        <button className="home-action home-action-list" type="button">
          <span className="home-action-title">Открыть список чатов</span>
          <span className="home-action-text">
            Вернитесь к уже созданным комнатам и продолжите переписку.
          </span>
        </button>
      </section>
    </main>
  );
}
