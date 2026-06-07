import { useState } from 'react';

export default function useHomePage() {
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

  return {
    inviteLink,
    setInviteLink,
    pasteError,
    setPasteError,
    handlePasteLink,
  };
}
