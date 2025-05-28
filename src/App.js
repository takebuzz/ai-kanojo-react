import React, { useState } from 'react';
import Chat from './components/Chat';

function App() {
  const [name, setName] = useState('');
  const [personality, setPersonality] = useState('');
  const [customHeader, setCustomHeader] = useState('');
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    if (name && personality) {
      setStarted(true);
    } else {
      alert("名前と性格を入力してね！");
    }
  };

  if (!started) {
    return (
      <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
        <h1>AI彼女シミュレーター 💘</h1>
        <div style={{ marginBottom: '1rem' }}>
          <label>彼女の名前：</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：みさき"
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>性格タイプ：</label>
          <input
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            placeholder="例：ツンデレ、癒し系、ギャル系 など"
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>カスタムヘッダー（任意）：</label>
          <input
            value={customHeader}
            onChange={(e) => setCustomHeader(e.target.value)}
            placeholder="例：俺の嫁・みさき様"
            style={{ width: '100%' }}
          />
        </div>
        <button onClick={handleStart}>スタート</button>
      </div>
    );
  }

  return (
    <Chat settings={{ name, personality, customHeader }} />
  );
}

export default App;
