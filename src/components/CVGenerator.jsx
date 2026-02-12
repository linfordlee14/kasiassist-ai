import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { callGeminiAPI } from '../api/gemini';

const CVGenerator = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    location: '',
    education: '',
    experience: '',
    skills: '',
    languages: ''
  });
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceWithAI, setEnhanceWithAI] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const enhanceCV = async (formData) => {
    const prompt = `You are a professional CV writer for the South African job market.

Improve the following CV sections to be more professional, impactful, and employer-friendly.
Use strong action verbs, quantify achievements where possible, and format properly.
Keep the content truthful - only improve the writing, don't add fake information.
Return ONLY the improved text, structured exactly like the input format below.

FULL NAME: ${formData.fullName}

EDUCATION:
${formData.education}

WORK EXPERIENCE:
${formData.experience}

SKILLS:
${formData.skills}

LANGUAGES:
${formData.languages}

Return the enhanced version in this exact format:
EDUCATION:
[enhanced education text]

WORK EXPERIENCE:
[enhanced experience text]

SKILLS:
[enhanced skills text]

LANGUAGES:
[enhanced languages text]`;

    try {
      const enhancedText = await callGeminiAPI(prompt);
      return parseEnhancedCV(enhancedText, formData);
    } catch (error) {
      console.error('AI enhancement failed in enhanceCV:', error);
      throw error;
    }
  };

  const parseEnhancedCV = (aiResponse, originalData) => {
    const sections = {
      education: originalData.education,
      experience: originalData.experience,
      skills: originalData.skills,
      languages: originalData.languages
    };

    // Extract EDUCATION section
    const eduMatch = aiResponse.match(/EDUCATION:\s*([\s\S]*?)(?=WORK EXPERIENCE:|$)/i);
    if (eduMatch) sections.education = eduMatch[1].trim();

    // Extract WORK EXPERIENCE section
    const expMatch = aiResponse.match(/WORK EXPERIENCE:\s*([\s\S]*?)(?=SKILLS:|$)/i);
    if (expMatch) sections.experience = expMatch[1].trim();

    // Extract SKILLS section
    const skillsMatch = aiResponse.match(/SKILLS:\s*([\s\S]*?)(?=LANGUAGES:|$)/i);
    if (skillsMatch) sections.skills = skillsMatch[1].trim();

    // Extract LANGUAGES section
    const langMatch = aiResponse.match(/LANGUAGES:\s*([\s\S]*?)$/i);
    if (langMatch) sections.languages = langMatch[1].trim();

    return {
      ...originalData,
      ...sections
    };
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    if (cleaned.startsWith('27') && !phone.startsWith('+')) {
      cleaned = '+' + cleaned;
    }

    if (cleaned.startsWith('+27')) {
      const core = cleaned.substring(3);
      if (core.length === 9) {
        return `+27 ${core.substring(0, 2)} ${core.substring(2, 5)} ${core.substring(5)}`;
      }
    }
    
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      return `0${cleaned.substring(1, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
    }

    if (cleaned.length === 9 && /^[1-9]/.test(cleaned)) {
      return `0${cleaned.substring(0, 2)} ${cleaned.substring(2, 5)} ${cleaned.substring(5)}`;
    }

    return phone;
  };

  const generatePDF = (data = formData) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(data.fullName || 'Your Name', 20, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const formattedPhone = formatPhoneNumber(data.phone);
    doc.text(`${formattedPhone || 'Phone'} | ${data.email || 'Email'}`, 20, 30);
    doc.text(data.location || 'Location', 20, 35);

    // Separator line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    doc.line(20, 38, 190, 38);
    
    let yPos = 50;

    const addSection = (title, content) => {
      if (!content) return;
      
      yPos += 5; // Spacing before section
      
      // Check for page overflow
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(title, 20, yPos);
      yPos += 8;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const splitText = doc.splitTextToSize(content, 170);
      
      // Check if content fits, if not add pages
      for (let i = 0; i < splitText.length; i++) {
        if (yPos > 280) {
            doc.addPage();
            yPos = 20;
        }
        doc.text(splitText[i], 20, yPos);
        yPos += 5;
      }
      yPos += 5; // Reduced from 10 since we add 5 at start of next section
    };
    
    addSection('Education', data.education);
    addSection('Work Experience', data.experience);
    addSection('Skills', data.skills);
    addSection('Languages', data.languages);
    
    const fileName = data.fullName 
      ? `${data.fullName.split(' ').join('_')}_CV.pdf` 
      : 'CV.pdf';
    doc.save(fileName);
  };

  const handleGeneratePDF = async () => {
    let cvData = formData;
    console.log('Enhance with AI:', enhanceWithAI);

    if (enhanceWithAI) {
      setIsEnhancing(true);
      try {
        console.log('Calling AI enhancement...');
        cvData = await enhanceCV(formData);
        console.log('Enhancement complete:', cvData);
      } catch (error) {
        console.error('Enhancement error:', error);
        alert(`AI enhancement failed: ${error.message}. Using original content.`);
      } finally {
        setIsEnhancing(false);
      }
    }

    generatePDF(cvData);
  };

  return (
    <div className="cv-generator">
      {isEnhancing && (
        <div className="enhancing-overlay">
          <div className="enhancing-loader">
            <div className="spinner"></div>
            <p>✨ Enhancing your CV with AI...</p>
          </div>
        </div>
      )}
      <fieldset disabled={isEnhancing} style={{ border: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            name="fullName" 
            value={formData.fullName} 
            onChange={handleChange} 
            placeholder="e.g. Thabo Mokoena" 
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="text" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="e.g. 012 345 6789" 
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="e.g. thabo@example.com" 
            />
          </div>
        </div>
        <div className="form-group">
          <label>Location (City, Province)</label>
          <input 
            type="text" 
            name="location" 
            value={formData.location} 
            onChange={handleChange} 
            placeholder="e.g. Soweto, Gauteng" 
          />
        </div>
        <div className="form-group">
          <label>Education</label>
          <textarea 
            name="education" 
            value={formData.education} 
            onChange={handleChange} 
            placeholder="List your qualifications, schools, and dates" 
            rows="4"
          />
        </div>
        <div className="form-group">
          <label>Work Experience</label>
          <textarea 
            name="experience" 
            value={formData.experience} 
            onChange={handleChange} 
            placeholder="List your previous jobs, responsibilities, and dates" 
            rows="5"
          />
        </div>
        <div className="form-group">
          <label>Skills</label>
          <textarea 
            name="skills" 
            value={formData.skills} 
            onChange={handleChange} 
            placeholder="e.g. Customer Service, Microsoft Office, Problem Solving" 
            rows="3"
          />
        </div>
        <div className="form-group">
          <label>Languages</label>
          <input 
            type="text" 
            name="languages" 
            value={formData.languages} 
            onChange={handleChange} 
            placeholder="e.g. English, Zulu, Sotho" 
          />
        </div>
      </fieldset>

      <div className="ai-toggle-container">
        <div className="ai-toggle-wrapper">
          <label className="switch">
            <input 
              type="checkbox" 
              checked={enhanceWithAI} 
              onChange={(e) => setEnhanceWithAI(e.target.checked)} 
            />
            <span className="slider round"></span>
          </label>
          <span className="toggle-label">✨ Enhance with AI</span>
        </div>
        <p className="toggle-desc">Let AI improve your CV content to be more professional and impactful</p>
      </div>

      <button 
        onClick={handleGeneratePDF}
        className="primary-btn generate-btn"
        disabled={isEnhancing || !formData.fullName}
      >
        {isEnhancing ? 'AI is polishing your CV...' : 'Generate CV PDF'}
      </button>
    </div>
  );
};

export default CVGenerator;
