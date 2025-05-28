import React, { useState } from 'react';

export default function Settings({ onSubmit }) {
  const [name, setName] = useState('');
  const [personality, setPersonality] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, personality });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>AI彼女をカスタムしよう</h2>
      <div>
        <label>名前：</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>性格：</label>
        <input value={personality} onChange={(e) => setPersonality(e.target.value)} required />
      </div>
      <button type="submit">彼女を生成する</button>
    </form>
  );
}