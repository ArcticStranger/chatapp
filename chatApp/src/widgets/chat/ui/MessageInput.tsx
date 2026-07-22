interface MessageInputProps {
  text: string;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function MessageInput({ text, onChange, onSubmit }: MessageInputProps) {
  return (
    <form onSubmit={onSubmit}>
      <input
        value={text}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Сообщение..."
      />
      <button type="submit">Отправить</button>
    </form>
  );
}
