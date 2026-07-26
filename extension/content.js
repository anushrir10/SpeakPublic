const API_URL = 'https://speakpublic-api.onrender.com';

async function fetchSimplifiedText(text) {
  try {
    const response = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language: 'Tamil' })
    });
    const data = await response.json();
    return data.simplified || 'No simplified result.';
  } catch (error) {
    return 'Error connecting to backend.';
  }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'SIMPLIFY_TEXT') {
    const simplified = await fetchSimplifiedText(message.text);
    sendResponse({ simplified });
  }
  return true;
});
