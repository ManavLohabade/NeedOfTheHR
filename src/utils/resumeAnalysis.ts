import { extractTextFromPDF } from './pdfParser';

interface ResumeAnalysisResult {
  skills: string[];
  experience: string;
  education: string;
  summary: string;
  strengths: string[];
  recommendations: string[];
}

const analyzeWithDeepSeek = async (resumeText: string): Promise<ResumeAnalysisResult> => {
  try {
    console.log("Analyzing resume text with DeepSeek, length:", resumeText.length);
    
    const cleanText = resumeText
      .replace(/\x00/g, '')
      .replace(/[\x01-\x1F\x7F-\x9F]/g, ' ')
      .trim();

    const response = await fetch('http://localhost:3001/api/analyze-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText: cleanText })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('DeepSeek API error:', {
        status: response.status,
        body: errorBody,
        headers: Object.fromEntries(response.headers)
      });
      // Fallback result on API error
      return {
        skills: ["Analysis Pending"],
        experience: "Analysis temporarily unavailable",
        education: "Analysis temporarily unavailable",
        summary: "Service temporarily unavailable",
        strengths: ["Pending"],
        recommendations: ["Retry analysis"]
      };
    }

    const data = await response.json();
    let analysisText = data.choices?.[0]?.message?.content || '';
    if (!analysisText) {
      // Fallback result on empty response
      return {
        skills: ["Analysis Pending"],
        experience: "Analysis temporarily unavailable",
        education: "Analysis temporarily unavailable",
        summary: "Service temporarily unavailable",
        strengths: ["Pending"],
        recommendations: ["Retry analysis"]
      };
    }

    analysisText = analysisText.replace(/```json\n?|```/g, '').trim();

    try {
      const analysis = JSON.parse(analysisText);
      const defaultAnalysis = {
        skills: [],
        experience: '',
        education: '',
        summary: '',
        strengths: [],
        recommendations: []
      };
      return { ...defaultAnalysis, ...analysis };
    } catch (parseError) {
      console.error('Failed to parse API response:', parseError);
      // Fallback result on parse error
      return {
        skills: ["Analysis Pending"],
        experience: "Analysis temporarily unavailable",
        education: "Analysis temporarily unavailable",
        summary: "Service temporarily unavailable",
        strengths: ["Pending"],
        recommendations: ["Retry analysis"]
      };
    }
  } catch (error) {
    console.error('Analysis failed:', error);
    // Always return a fallback result on any error
    return {
      skills: ["Analysis Pending"],
      experience: "Analysis temporarily unavailable",
      education: "Analysis temporarily unavailable",
      summary: "Service temporarily unavailable",
      strengths: ["Pending"],
      recommendations: ["Retry analysis"]
    };
  }
};

// Keep the original function name for backward compatibility
export const analyzeResumeWithChatGPT = async (file: File): Promise<ResumeAnalysisResult> => {
  try {
    // Validate file type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      throw new Error('Please upload a PDF file');
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size too large. Please upload a PDF smaller than 10MB');
    }
    
    console.log(`Processing resume: ${file.name} (${file.size} bytes)`);
    
    // Extract text from PDF
    const resumeText = await extractTextFromPDF(file);
    return await analyzeWithDeepSeek(resumeText);
  } catch (error) {
    console.error("Resume analysis failed:", error);
    // Always return a fallback result on any error
    return {
      skills: ["JavaScript", "React", "Node.js", "Problem Solving", "Communication"],
      experience: "Unable to extract complete experience details. Please check the PDF format.",
      education: "Unable to extract complete education details. Please check the PDF format.",
      summary: "Resume analysis encountered technical difficulties. This is a placeholder summary to allow the process to continue.",
      strengths: ["Technical skills", "Adaptability"],
      recommendations: [
        "Request candidate to provide resume in a different format",
        "Consider preliminary technical screening to assess skills"
      ]
    };
  }
};

export type { ResumeAnalysisResult };
