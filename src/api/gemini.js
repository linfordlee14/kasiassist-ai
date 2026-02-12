const getCachedResponse = (prompt) => {
  const cache = JSON.parse(localStorage.getItem('aiCache') || '{}');
  return cache[prompt];
};

const setCachedResponse = (prompt, response) => {
  const cache = JSON.parse(localStorage.getItem('aiCache') || '{}');
  cache[prompt] = {
    response,
    timestamp: Date.now()
  };
  // Keep only last 10 responses
  const entries = Object.entries(cache);
  if (entries.length > 10) {
    const sorted = entries.sort((a, b) => b.timestamp - a.timestamp);
    const limited = Object.fromEntries(sorted.slice(0, 10));
    localStorage.setItem('aiCache', JSON.stringify(limited));
  } else {
    localStorage.setItem('aiCache', JSON.stringify(cache));
  }
};

export async function callGeminiAPI(prompt) {
  const cached = getCachedResponse(prompt);
  if (cached) {
    console.log('Using cached response');
    return cached.response;
  }

  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('We\'re getting a lot of requests right now. Please wait 30 seconds and try again.');
    }
    throw new Error('Something went wrong. Please try again in a moment.');
  }

  const data = await response.json();
  setCachedResponse(prompt, data.text);
  return data.text;
}
