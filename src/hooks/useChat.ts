import { useState } from 'react';

type Message = {
  type: 'user' | 'bot';
  text: string;
};

const useChat = () => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async (file: File | null) => {
    if (!file) return;

    const formData = new FormData();

    formData.append('query', input);
    formData.append('file', file);

    const response = await fetch('/api/analyze', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    setMessages([...messages, { type: 'user', text: input }, { type: 'bot', text: data.analysis }]);
    setInput('');
  };

  return {
    input,
    setInput,
    messages,
    sendMessage,
  };
};

export default useChat;
