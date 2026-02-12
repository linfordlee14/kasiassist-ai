# KasiAssist AI 🇿🇦

**Empowering South African township youth and small businesses with AI-powered tools.**

🔗 **[Live Demo](https://kasiassist-ai.vercel.app)** | 📺 **[Demo Video](youtube-link)** | 🏆 **[Devpost](devpost-link)**

---

## 🌟 About

KasiAssist AI is a web application designed to help township communities in South Africa access opportunities, grow businesses, and communicate professionally using artificial intelligence.

Built for the **Intwana Yase Kasi – Innovation Challenge 2026**.

---

## ✨ Features

### 📄 CV Helper
Get AI-powered assistance with professional CV summaries and cover letters tailored for the South African job market.

### 💼 Business Assistant
Create effective WhatsApp messages, promotions, and business communications for spaza shops and small businesses.

### 🎯 Opportunity Explainer
Simplify complex job posts, bursaries, and training opportunities into easy-to-understand language.

### 📋 CV PDF Generator
Fill in a simple form and generate a professionally formatted CV as a downloadable PDF. Includes optional **AI Enhancement** to transform basic text into employer-ready content.

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite
- **Backend:** Vercel Serverless Functions (Node.js)
- **AI:** Google Gemini API
- **PDF Generation:** jsPDF
- **Styling:** Custom CSS (Mobile-first responsive design)
- **Deployment:** Vercel
- **Version Control:** GitHub

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/linfordlee14/kasiassist-ai.git
   cd kasiassist-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173`

### Deployment

This project is configured for Vercel deployment:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add `GEMINI_API_KEY` as an environment variable in Vercel settings
4. Deploy!

---

## 📂 Project Structure

```text
kasiassist-ai/
├── api/
│   └── gemini.js          # Serverless API endpoint
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx
│   │   ├── AuthPage.jsx
│   │   ├── MainApp.jsx
│   │   └── CVGenerator.jsx
│   ├── api/
│   │   └── gemini.js      # Frontend API calls
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── public/
├── package.json
├── vite.config.js
└── README.md
```

---

## 🎯 Usage Examples

### CV Helper Example
**Input:**
> I finished matric in 2023 and I'm looking for a general worker position. 
> I'm hardworking, punctual, and good with my hands.

**Output:**
Professional CV text with structured sections, action verbs, and employer-friendly language.

### Business Assistant Example
**Input:**
> Tell my customers that fresh bread and milk just arrived at my spaza shop

**Output:**
> 🍞 Fresh Bread & Milk Just Arrived! 🥛
> 
> Good morning! We've just received fresh bread and milk at [Shop Name]. 
> Come through before it's finished! 
> 
> Open until 7pm. See you soon! 

---

## 🔒 Security & Rate Limiting

- API keys are stored securely as environment variables
- Serverless backend prevents frontend exposure of sensitive keys
- IP-based rate limiting (10 requests/minute)
- Frontend cooldown timers (5 seconds between requests)
- Response caching to reduce unnecessary API calls

---

## 🌍 Impact

KasiAssist AI addresses real barriers faced by South African township communities:

- **Unemployment:** Professional CVs increase job application success rates
- **Business Growth:** Clear messaging helps small businesses attract customers
- **Access to Opportunities:** Simplified information makes bursaries and training accessible

---

## 🔮 Roadmap

### Short-term (Next 3 months)
- 🇿🇦 Multilingual support (Zulu, Xhosa, Afrikaans)
- 🎙️ Voice input functionality
- 🔍 Job matching recommendations

### Long-term (6-12 months)
- 🤝 NGO and community center partnerships
- 📱 SMS/WhatsApp bot integration
- 📶 Offline mode for low-connectivity areas
- 🌍 Expansion to other African countries

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👤 Author

**Linford Lee**
- GitHub: [@linfordlee14](https://github.com/linfordlee14)
- Email: linfordlee14@gmail.com

---

## 🙏 Acknowledgments

- Built for the **Intwana Yase Kasi – Innovation Challenge 2026**
- Powered by **Google Gemini API**
- Deployed on **Vercel**
- Developed with **JetBrains tools** and **Junie AI Agent**

---

## 📸 Screenshots

- Landing Page
- CV Helper
- CV PDF Generator

---

**Made with ❤️ for South African townships**
