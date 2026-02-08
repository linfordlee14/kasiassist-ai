import React from 'react';

const LandingPage = ({ onGetStarted }) => {
  return (
    <section id="landing-page" className="view">
      <header>
        <h1>KasiAssist AI</h1>
        <p>Empowering our community with AI-driven tools.</p>
      </header>
      <main>
        <div className="features">
          <div className="feature">
            <h3>CV Helper</h3>
            <p>Get help with professional summaries and formatting.</p>
          </div>
          <div className="feature">
            <h3>Business Assistant</h3>
            <p>Tips for local entrepreneurship and marketing ideas.</p>
          </div>
          <div className="feature">
            <h3>Opportunity Explainer</h3>
            <p>Simplifying complex job descriptions and grants.</p>
          </div>
        </div>
        <button className="primary-btn" onClick={onGetStarted}>Get Started</button>
      </main>
    </section>
  );
};

export default LandingPage;
