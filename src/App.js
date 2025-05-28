import React, { useState } from 'react';
import Settings from './components/Settings';
import Chat from './components/Chat';

export default function App() {
  const [settings, setSettings] = useState(null);

  return (
    <div>
      {!settings ? (
        <Settings onSubmit={setSettings} />
      ) : (
        <Chat settings={settings} />
      )}
    </div>
  );
}