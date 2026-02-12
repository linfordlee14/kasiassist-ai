/**
 * KasiAssist AI - Gemini API Proxy (Serverless Function)
 * 
 * SUMMARY OF CHANGES:
 * - Created this serverless function to securely handle Gemini API calls.
 * - Moved the GEMINI_API_KEY from the frontend to process.env.GEMINI_API_KEY.
 * - Implemented a POST handler that takes a 'prompt' and returns '{ text }'.
 * - Added error handling for missing prompts, missing API keys, and Google API errors.
 * 
 * This file lives on the server (Vercel) to keep our API key hidden from the browser.
 */

const rateLimit = new Map();
const MAX_REQUESTS_PER_MINUTE = 10;
const WINDOW_MS = 60000; // 1 minute

export default async function handler(req, res) {
    // Get client IP
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Check rate limit
    const now = Date.now();
    const userRequests = rateLimit.get(ip) || [];
    const recentRequests = userRequests.filter(time => now - time < WINDOW_MS);

    if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
        return res.status(429).json({
            error: 'Too many requests. Please wait a minute and try again.'
        });
    }

    // Add current request
    recentRequests.push(now);
    rateLimit.set(ip, recentRequests);

    // Clean old entries periodically
    if (Math.random() < 0.1) { // 10% chance
        for (const [key, times] of rateLimit.entries()) {
            const valid = times.filter(time => now - time < WINDOW_MS);
            if (valid.length === 0) {
                rateLimit.delete(key);
            } else {
                rateLimit.set(key, valid);
            }
        }
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    const { prompt } = req.body;

    // Basic validation
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required.' });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

    if (!API_KEY) {
        console.error('GEMINI_API_KEY is not set in environment variables.');
        return res.status(500).json({ error: 'Server configuration error.' });
    }

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Gemini API Error:', data);
            return res.status(response.status).json({ 
                error: data.error?.message || 'Error from Gemini API' 
            });
        }

        // Extract the text content from the Gemini response
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
            return res.status(500).json({ error: 'Invalid response from Gemini API' });
        }

        // Return only the text to the frontend
        return res.status(200).json({ text: generatedText });

    } catch (error) {
        console.error('Fetch Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
