import React, { useState } from 'react';

export default function Chat({ settings }) {
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: `あなたは${settings.personality}な彼女としてふるまいます。ユーザーの名前は${settings.name}です。`,
    },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: newMessages,
        }),
      });

      const data = await response.json();

      if (!data.choices || !data.choices[0]) {
        console.error("APIエラーのレスポンス内容:", data);
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: `エラーが発生しました：${data.error?.message || '詳細不明'}`,
          },
        ]);
        return;
      }

      const aiMessage = data.choices[0].message;
      setMessages([...newMessages, aiMessage]);
    } catch (error) {
      console.error('送信時の通信エラー:', error);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: '通信エラーが発生しました。しばらくしてからもう一度お試しください。',
        },
      ]);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{settings.name}ちゃんとのチャット</h2>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          height: '300px',
          overflowY: 'scroll',
          marginBottom: '10px',
        }}
      >
        {messages.slice(1).map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.role === 'user' ? 'あなた' : settings.name}：</strong>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="メッセージを入力..."
        style={{ width: '70%', marginRight: '10px' }}
      />
      <button onClick={sendMessage}>送信</button>
    </div>
  );
}
