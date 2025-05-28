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

  const headerText = settings.customHeader?.trim()
    ? settings.customHeader
    : `💖 ${settings.name}（${settings.personality}）ちゃん`;

  const avatarUrl = "https://1.bp.blogspot.com/-STxSApXqqxg/XVesvHTM9ZI/AAAAAAABU3g/1eXwTw6-VSkwij2U1tuSrJ0gRv5V-1aVACLcBGAs/s400/pose_kimegao_gal_woman.png";

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{
        backgroundColor: '#f7f7f7',
        padding: '1rem',
        marginBottom: '10px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '18px'
      }}>
        {headerText}
      </div>

      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          height: '300px',
          overflowY: 'scroll',
          marginBottom: '10px',
          backgroundColor: '#fff',
          borderRadius: '10px',
        }}
      >
        {messages.slice(1).map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '10px',
            }}
          >
            {msg.role !== 'user' && (
              <img
                src={avatarUrl}
                alt="AI彼女"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  marginRight: '8px',
                  objectFit: 'cover',
                }}
              />
            )}
            <div
              style={{
                maxWidth: '70%',
                padding: '10px 15px',
                borderRadius: '20px',
                backgroundColor: msg.role === 'user' ? '#dcf8c6' : '#f1f0f0',
                color: '#000',
                textAlign: 'left',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.4',
              }}
            >
              <strong style={{ fontSize: '12px', color: '#888' }}>
                {msg.role === 'user' ? 'あなた' : settings.name}
              </strong>
              <div>{msg.content}</div>
            </div>
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
