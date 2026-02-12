import React, { useState } from 'react';
import ModeButton from './ModeButton';
import CVGenerator from './CVGenerator';
import { callGeminiAPI } from '../api/gemini';

const MODES = {
  cv: {
    title: 'CV Helper',
    desc: 'Enter your details or paste your draft to get AI assistance.',
    context: 'You are a career coach for township youth. Help the user with their CV or cover letter. Provide a professional summary, strong job bullets, or advice on layout. Structure: Use headings (###) and bullet points (-) for clarity.'
  },
  business: {
    title: 'Business Assistant',
    desc: 'Get practical tips for your small business, marketing, or simple math.',
    context: 'You are a business mentor for township entrepreneurs. Give practical advice on marketing, basic business math, or growth. Keep it realistic for a "Kasi" context. Structure: Use headings (###) and bullet points (-) for clarity.'
  },
  opportunity: {
    title: 'Opportunity Explainer',
    desc: 'Simplifying complex job descriptions and grants.',
    context: 'You are an expert at simplifying complex job ads or grant requirements. Break down jargon into "plain English". Explain: 1. What is this? 2. What do I need? 3. How do I apply? Structure: Use headings (###) and bullet points (-) for clarity.'
  },
  cvGenerator: {
    title: 'CV Generator',
    desc: 'Fill in your details to generate a professional PDF CV.',
    context: ''
  }
};

const SYSTEM_PROMPT = `You are KasiAssist AI, a helpful assistant dedicated to township youth and small business owners in South Africa. 
Your goal is to provide practical, encouraging, and easy-to-understand advice. 
Use simple language, avoid jargon, and focus on actionable steps. 
Always be respectful, professional, and approachable.`;

const MainApp = ({ userName, onLogout }) => {
  const [currentMode, setCurrentMode] = useState('cv');
  const [userInput, setUserInput] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!userInput.trim() || isLoading) return;

    setIsLoading(true);
    setAiOutput('');

    try {
      const prompt = `${SYSTEM_PROMPT}\n\nUser Context: ${MODES[currentMode].context}\n\nUser Input: ${userInput}`;
      const responseText = await callGeminiAPI(prompt);
      setAiOutput(responseText);
    } catch (error) {
      setAiOutput(`Sorry, I hit a snag. (${error.message})`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatResponse = (text) => {
    if (!text) return null;
    return text
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('### ')) {
          return <h3 key={i}>{line.replace('### ', '')}</h3>;
        }
        // Simple bold/italic markdown support
        let formattedLine = line;
        // This is a very basic replacement, in a real app we might use a markdown library
        return <p key={i}>{formattedLine}</p>;
      });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiOutput).then(() => {
      alert('Copied to clipboard!');
    });
  };

  return (
    <section id="main-app" className="view">
      <header className="app-header">
        <h2 id="welcome-msg">Hello, {userName}!</h2>
        <button onClick={onLogout} className="secondary-btn">Change Name</button>
      </header>

      <nav className="mode-selector">
        {Object.keys(MODES).map((mode) => (
          <ModeButton 
            key={mode} 
            mode={mode} 
            active={currentMode === mode} 
            onClick={(m) => {
                setCurrentMode(m);
                setAiOutput('');
                setUserInput('');
            }}
          >
            {MODES[mode].title}
          </ModeButton>
        ))}
      </nav>

      <main className="app-content">
        <div id="mode-info">
          <h3>{MODES[currentMode].title}</h3>
          <p>{MODES[currentMode].desc}</p>
        </div>

        {currentMode === 'cvGenerator' ? (
          <CVGenerator />
        ) : (
          <div className="chat-container">
            <div className="output-area">
              {isLoading ? (
                <p className="loading-text">Generating response, please wait...</p>
              ) : aiOutput ? (
                <div className="ai-response">{formatResponse(aiOutput)}</div>
              ) : (
                <p className="placeholder-text">AI response will appear here...</p>
              )}
            </div>
            
            {aiOutput && !isLoading && (
              <div className="action-buttons">
                <button onClick={copyToClipboard} className="secondary-btn">Copy to Clipboard</button>
              </div>
            )}

            <div className="input-container">
              <textarea 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your details or paste text here (e.g., your job history or a business idea)..."
              />
              <button 
                onClick={handleGenerate} 
                className="primary-btn"
                disabled={isLoading || !userInput.trim()}
              >
                {isLoading ? 'Thinking...' : 'Ask AI Assistant'}
              </button>
            </div>
          </div>
        )}
      </main>
    </section>
  );
};

export default MainApp;
