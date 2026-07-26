import { useState } from 'react';
import QRSection from './components/QRSection';

const API_BASE = import.meta.env.VITE_API_URL;

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [language, setLanguage] = useState('Tamil');
  const [status, setStatus] = useState('');

  async function handleSubmit() {
    if (!text) return;
    setStatus('Processing...');
    try {
      const res = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language })
      });
      const data = await res.json();
      setResult(data.simplified || 'No response');
      setStatus('Done');
    } catch (error) {
      setStatus('Error connecting to backend');
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <h1>SpeakPublic</h1>
        <p>Convert dense public text into simplified language in your preferred regional language.</p>
      </header>

      <main className="container">
        <div className="card">
          <label>Preferred Language</label>
          <select value={language} onChange={e => setLanguage(e.target.value)}>
            <option>Tamil</option>
            <option>Hindi</option>
            <option>Bengali</option>
            <option>Odia</option>
          </select>

          <label>Paste text to simplify</label>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={8} />
          <button onClick={handleSubmit}>Convert</button>
          <p className="status">{status}</p>
        </div>

        <div className="card result-card">
          <h2>Result</h2>
          <div className="result-box">{result}</div>
        </div>
      </main>
      <QRSection url={`${API_BASE}/app`} />
    </div>
  );
}

export default App;
