interface MessageBubbleProps {
  text: string;
  isOwn: boolean;
  isHost: boolean;
}

export function MessageBubble({ text, isOwn, isHost }: MessageBubbleProps) {
  const label = isOwn ? 'Вы' : isHost ? 'Хост' : 'Гость';
  return (
    <p>
      <b>{label}:</b> {text}
    </p>
  );
}
