const API_URL = 'https://speakpublic-api.onrender.com';

const textInput = document.getElementById('textInput');
const resultOutput = document.getElementById('result');
const convertBtn = document.getElementById('convertBtn');

convertBtn.addEventListener('click', async () => {
  const text = textInput.value.trim();
  if (!text) return;
  resultOutput.textContent = 'Converting...';

  try {
    const response = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language: 'Tamil' })
    });
    const data = await response.json();
    resultOutput.textContent = data.simplified || 'No response from API.';
  } catch (err) {
    resultOutput.textContent = 'Error connecting to backend.';
  }
});
