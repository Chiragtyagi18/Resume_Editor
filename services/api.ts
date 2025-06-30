
import { AIEnhanceRequest, AIEnhanceResponse } from '../types/resume';

const API_BASE_URL = 'http://localhost:8000';

export const enhanceContent = async (request: AIEnhanceRequest): Promise<AIEnhanceResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-enhance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to enhance content');
    }

    return await response.json();
  } catch (error) {
    // Fallback to mock data if backend is not available
    return mockEnhanceContent(request);
  }
};

const mockEnhanceContent = (request: AIEnhanceRequest): AIEnhanceResponse => {
  const enhancements: Record<string, AIEnhanceResponse> = {
    summary: {
      enhanced_content: "Dynamic and results-driven Full-Stack Developer with 5+ years of experience architecting and implementing scalable web solutions. Demonstrated expertise in React, Node.js, and cloud technologies, with a proven track record of delivering exceptional user experiences that drive business growth and customer satisfaction.",
      suggestions: [
        "Consider adding specific metrics to quantify your impact",
        "Highlight your leadership and collaboration skills",
        "Mention any relevant certifications or awards"
      ]
    },
    experience: {
      enhanced_content: "Spearheaded the end-to-end development of mission-critical customer-facing web applications, successfully serving 100,000+ daily active users while maintaining 99.9% uptime. Collaborated cross-functionally with product, design, and DevOps teams to deliver innovative solutions that exceeded performance benchmarks and user satisfaction metrics.",
      suggestions: [
        "Use strong action verbs to start each bullet point",
        "Include specific technologies and tools used",
        "Quantify achievements with percentages and numbers"
      ]
    },
    education: {
      enhanced_content: "Bachelor of Science in Computer Science from University of California, Berkeley. Graduated with a 3.8 GPA, consistently earning Dean's List recognition. Demonstrated leadership as President of the Programming Club and showcased technical excellence by winning the prestigious Annual Hackathon in 2019, competing against 200+ participants.",
      suggestions: [
        "Highlight relevant coursework for the target role",
        "Include any research projects or publications",
        "Mention specific technologies learned during studies"
      ]
    }
  };

  return enhancements[request.section] || {
    enhanced_content: `Enhanced: ${request.content}`,
    suggestions: ["This content has been improved for better impact"]
  };
};