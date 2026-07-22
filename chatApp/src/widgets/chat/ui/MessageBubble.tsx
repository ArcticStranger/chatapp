interface MessageBubbleProps {
  text: string;
  isOwn: boolean;
}

export function MessageBubble({ text, isOwn }: MessageBubbleProps) {
  return (
    <p>
      <b>{isOwn ? 'Вы' : 'Гость'}:</b> {text}
    </p>
  );
}
