const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 3001;

function simplifyText(text) {
  if (!text) return 'No text provided.';
  const sentences = text
    .replace(/\n/g, ' ')
    .split(/\. |\? |! /)
    .filter(Boolean)
    .slice(0, 5);
  return sentences.map((sentence, index) => `${index + 1}. ${sentence.trim()}`).join('\n');
}

// Serve legacy root site (index.html at repository root)
const rootStatic = path.join(__dirname, '..');
app.use('/', express.static(rootStatic));
app.get('/', (req, res) => {
  res.sendFile(path.join(rootStatic, 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/analyze', (req, res) => {
  const { text, language } = req.body || {};
  const simplified = simplifyText(text || '');
  const responseText = language ? `(${language}) ${simplified}` : simplified;
  res.json({
    status: 'ok',
    language: language || 'default',
    simplified: responseText
  });
});

app.post('/api/extract-actions', (req, res) => {
  const { text, language } = req.body || {};
  const items = (text || '')
    .split(/\n|\.|\?|!/) 
    .map(item => item.trim())
    .filter(Boolean)
    .slice(0, 4);

  const actions = items.map((item, index) => ({
    id: index + 1,
    action: language ? `(${language}) ${item}` : item,
    when: 'ASAP',
    where: 'Local office'
  }));

  res.json({ status: 'ok', actions });
});

app.post('/api/generate-form-guide', (req, res) => {
  const { form_text, language, form_type } = req.body || {};
  const lines = (form_text || '')
    .split(/\n/) 
    .map(line => line.trim())
    .filter(Boolean)
    .slice(0, 8);

  const steps = lines.map((line, index) => ({
    step_number: index + 1,
    field_name: `Field ${index + 1}`,
    what_to_write: language ? `(${language}) ${line}` : line,
    example: `Example for field ${index + 1}`,
    tip: `Make sure to answer clearly.`
  }));

  res.json({
    status: 'ok',
    form_title: language ? `(${language}) ${form_type || 'Form Guide'}` : form_type || 'Form Guide',
    steps
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SpeakPublic backend running on http://0.0.0.0:${PORT}`);
});

// Serve landing (React) build at /app so legacy index.html and new SPA both work
const landingDist = path.join(__dirname, '..', 'landing', 'dist');
app.use('/app', express.static(landingDist));

app.get('/app/*', (req, res) => {
  res.sendFile(path.join(landingDist, 'index.html'));
});
