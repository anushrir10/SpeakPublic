const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

const port = 3001;

function translate(lang, text) {
  if (!lang) return text;
  const l = (lang || '').toLowerCase();
  if (l.includes('tamil')) return '[தமிழ்] ' + text;
  if (l.includes('hindi')) return '[हिन्दी] ' + text;
  return text;
}

function simplifyText(text) {
  // Very small simplifier: split into sentences and keep short versions
  const parts = (text || '').split(/\.|\n/).map(s => s.trim()).filter(Boolean);
  if (parts.length === 0) return 'No content provided.';
  const out = parts.slice(0, 6).map((p, i) => `${i+1}. ${p.length>120 ? p.slice(0,120)+'...' : p}`);
  return out.join('\n');
}

app.post('/api/analyze', (req, res) => {
  const { text, language } = req.body || {};
  const simplified = simplifyText(text || '');
  const label = 'Simple';
  res.json({ label, simplified: translate(language, simplified) });
});

app.post('/api/extract-actions', (req, res) => {
  const { text, language } = req.body || {};
  const sentences = (text || '').split(/[.\n]/).map(s => s.trim()).filter(Boolean);
  const actions = sentences.slice(0,5).map((s, i) => ({ what: translate(language, s), when: translate(language, 'As soon as possible'), where: translate(language, 'At the relevant office') }));
  res.json({ actions });
});

app.get('/api/fetch-url', (req, res) => {
  const url = req.query.url || '';
  // For safety in local environment, return a mock extraction
  res.json({ title: `Mock: ${url}`, text: `This is a mock extracted text for ${url}.` });
});

app.post('/api/generate-form-guide', (req, res) => {
  const { form_text, language, form_type } = req.body || {};
  const lines = (form_text || '').split(/\n/).map(l => l.trim()).filter(Boolean);
  const steps = lines.slice(0,10).map((l, i) => ({ step_number: i+1, field_name: `Field ${i+1}`, what_to_write: translate(language, l), example: translate(language, `Example for field ${i+1}`), tip: translate(language, `Tip for field ${i+1}`) }));
  res.json({ form_title: translate(language, `Guide for ${form_type || 'Form'}`), steps });
});

app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON payload' });
  }
  next(err);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend mock server running on http://0.0.0.0:${port}`);
});
