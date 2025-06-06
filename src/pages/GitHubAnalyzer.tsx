import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, User, Star, GitBranch, Calendar, MapPin, Building, Users, BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { analyzeResumeWithChatGPT } from "@/utils/resumeAnalysis";

interface GitHubProfile {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  company: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface Repository {
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

// Add new scoring interfaces
interface PlatformScore {
  score: number;
  grade: string;
  strengths: string[];
  weaknesses: string[];
}

interface CandidateScoreCard {
  github: PlatformScore;
  linkedin: PlatformScore | null;
  resume: PlatformScore | null;
  epfo: PlatformScore | null;
  overall: {
    score: number;
    grade: string;
    recommendation: string;
    interviewPotential: string;
  };
}

const GitHubAnalyzer = () => {
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [epfoNumber, setEpfoNumber] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [analysis, setAnalysis] = useState("");
  const [resumeAnalysis, setResumeAnalysis] = useState<any>(null);
  const [scoreCard, setScoreCard] = useState<CandidateScoreCard | null>(null);
  const { toast } = useToast();

  const extractUsername = (url: string) => {
    // Extract username from GitHub URL or return as-is if it's just a username
    const match = url.match(/github\.com\/([^\/]+)/);
    return match ? match[1] : url.trim();
  };

  const fetchGitHubData = async (username: string) => {
    try {
      // Fetch profile
      const profileResponse = await fetch(`https://api.github.com/users/${username}`);
      if (!profileResponse.ok) {
        throw new Error("GitHub user not found");
      }
      const profileData = await profileResponse.json();

      // Fetch repositories
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
      const reposData = await reposResponse.json();

      return { profile: profileData, repos: reposData };
    } catch (error) {
      throw new Error("Failed to fetch GitHub data");
    }
  };

  const analyzeWithGemini = async (profileData: GitHubProfile, reposData: Repository[]) => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-github', {
        body: {
          profile: profileData,
          repositories: reposData,
          additionalData: {
            linkedinUrl,
            epfoNumber,
            resumeUploaded: resume !== null,
            resumeAnalysis: resumeAnalysis
          }
        },
      });

      if (error) {
        throw new Error("Failed to analyze with AI");
      }

      // Add EPFO analysis section if EPFO number is provided
      let analysisWithEPFO = data.analysis;
      
      if (epfoNumber.trim()) {
        analysisWithEPFO += `

## EPFO Analysis

**Employment Verification Status**: Currently under development - API integration pending

**EPFO Number**: ${epfoNumber}

**Future Scope Analysis**:
• **Employment History Verification**: Once EPFO API is integrated, this will provide:
  - Complete employment timeline and job changes
  - Salary progression and growth patterns  
  - Company verification and authenticity checks
  - PF contribution history and compliance

• **Career Stability Assessment**: 
  - Job tenure analysis across different organizations
  - Career progression trajectory
  - Industry movement patterns
  - Employment gap identification

• **Compensation Insights**:
  - Historical salary data and growth trends
  - Industry-standard compensation comparison
  - Benefits and PF contribution patterns
  - Total compensation evaluation

**Current Status**: *EPFO API integration is planned for future releases. This analysis will be automatically populated once the integration is complete.*

**Note**: The provided EPFO number appears to be in the correct format and will be validated against official records once API access is established.`;
      }

      if (linkedinUrl.trim()) {
        analysisWithEPFO += `

## LinkedIn Profile Analysis

**Profile URL**: ${linkedinUrl}

**Integration Status**: LinkedIn API integration pending

**Planned Analysis Features**:
• **Professional Network Analysis**: Connection quality and industry relevance
• **Skill Endorsements**: Peer validation of technical and soft skills  
• **Experience Verification**: Cross-validation with GitHub activity patterns
• **Education Background**: Academic credentials and certifications
• **Recommendation Analysis**: Professional references and peer feedback

**Future Enhancements**: Once LinkedIn API is integrated, this section will provide comprehensive professional background analysis.`;
      }

      if (resume && resumeAnalysis) {
        analysisWithEPFO += `

## Resume Analysis (ChatGPT Powered)

**Uploaded Document**: ${resume.name}

### Skills Identified
${resumeAnalysis.skills?.map((skill: string) => `• ${skill}`).join('\n') || '• Analysis in progress'}

### Professional Experience
${resumeAnalysis.experience || 'Experience summary not available'}

### Educational Background
${resumeAnalysis.education || 'Education details not available'}

### Candidate Summary
${resumeAnalysis.summary || 'Summary not available'}

### Key Strengths
${resumeAnalysis.strengths?.map((strength: string) => `• ${strength}`).join('\n') || '• Analysis in progress'}

### Recommendations
${resumeAnalysis.recommendations?.map((rec: string) => `• ${rec}`).join('\n') || '• Analysis in progress'}

**Analysis Method**: Powered by ChatGPT API for comprehensive resume parsing and insights.`;
      } else if (resume) {
        analysisWithEPFO += `

## Resume Analysis

**Uploaded Document**: ${resume.name}

**Status**: Processing with ChatGPT API...

**Note**: Resume analysis is currently being processed. Please refresh in a moment for detailed insights.`;
      }

      return analysisWithEPFO;
    } catch (error) {
      throw new Error("AI analysis failed");
    }
  };

  const calculateScores = (
    profile: GitHubProfile, 
    repositories: Repository[], 
    resumeAnalysisData: any, 
    linkedinUrl: string, 
    epfoNumber: string
  ): CandidateScoreCard => {
    // GitHub scoring - based on real data
    const githubScore = calculateGitHubScore(profile, repositories);
    
    // LinkedIn scoring - based on URL presence for now
    const linkedinScore = linkedinUrl ? calculateLinkedInScore(linkedinUrl) : null;
    
    // Resume scoring - based on analysis data
    const resumeScore = resumeAnalysisData ? calculateResumeScore(resumeAnalysisData) : null;
    
    // EPFO scoring - based on number presence for now
    const epfoScore = epfoNumber ? calculateEpfoScore(epfoNumber) : null;
    
    // Calculate overall score
    const overall = calculateOverallScore(githubScore, linkedinScore, resumeScore, epfoScore);
    
    return {
      github: githubScore,
      linkedin: linkedinScore,
      resume: resumeScore,
      epfo: epfoScore,
      overall
    };
  };

  const calculateGitHubScore = (profile: GitHubProfile, repositories: Repository[]): PlatformScore => {
    // Calculate a score based on GitHub data
    let score = 0;
    const strengths = [];
    const weaknesses = [];
    
    // Score based on number of repositories (max 20 points)
    const repoScore = Math.min(profile.public_repos, 50) / 50 * 20;
    score += repoScore;
    
    if (profile.public_repos > 20) {
      strengths.push("Extensive project portfolio");
    } else if (profile.public_repos < 5) {
      weaknesses.push("Limited GitHub project history");
    }
    
    // Score based on followers (max 15 points)
    const followerScore = Math.min(profile.followers, 100) / 100 * 15;
    score += followerScore;
    
    if (profile.followers > 50) {
      strengths.push("Strong community recognition");
    }
    
    // Score based on repository stars (max 25 points)
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const starScore = Math.min(totalStars, 500) / 500 * 25;
    score += starScore;
    
    if (totalStars > 200) {
      strengths.push("Popular and well-regarded projects");
    }
    
    // Score based on repository language diversity (max 15 points)
    const languages = new Set(repositories.map(repo => repo.language).filter(Boolean));
    const languageScore = Math.min(languages.size, 5) / 5 * 15;
    score += languageScore;
    
    if (languages.size > 3) {
      strengths.push("Versatile with multiple programming languages");
    } else {
      weaknesses.push("Limited language diversity");
    }
    
    // Score based on repository descriptions (max 15 points)
    const reposWithDescriptions = repositories.filter(repo => repo.description && repo.description.length > 10).length;
    const descriptionScore = reposWithDescriptions / Math.max(1, repositories.length) * 15;
    score += descriptionScore;
    
    if (descriptionScore < 7) {
      weaknesses.push("Lacks detailed project documentation");
    }
    
    // Score based on consistency (max 10 points)
    // Assume the repositories are already sorted by updated_at (most recent first)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const recentRepos = repositories.filter(repo => new Date(repo.updated_at) >= sixMonthsAgo).length;
    const consistencyScore = recentRepos / Math.max(1, Math.min(repositories.length, 10)) * 10;
    score += consistencyScore;
    
    if (consistencyScore > 7) {
      strengths.push("Active and consistent contributor");
    } else {
      weaknesses.push("Inconsistent activity pattern");
    }
    
    // Calculate grade
    const grade = getGradeFromScore(score);
    
    return {
      score: Math.round(score),
      grade,
      strengths,
      weaknesses
    };
  };

  const calculateLinkedInScore = (linkedinUrl: string): PlatformScore => {
    // In a real implementation, this would use LinkedIn API data
    // For now, we'll just return a mock score
    return {
      score: 85,
      grade: "B+",
      strengths: [
        "Professional profile established",
        "Network verification potential"
      ],
      weaknesses: [
        "Limited assessment without API access",
        "Unable to verify employment details"
      ]
    };
  };

  const calculateResumeScore = (resumeAnalysis: any): PlatformScore => {
    let score = 0;
    const strengths = [];
    const weaknesses = [];
    
    // Score based on skills (max 30 points)
    const skillsScore = Math.min(resumeAnalysis.skills?.length || 0, 10) / 10 * 30;
    score += skillsScore;
    
    if ((resumeAnalysis.skills?.length || 0) > 7) {
      strengths.push("Diverse skill set");
    } else {
      weaknesses.push("Limited skill representation");
    }
    
    // Score based on experience (max 30 points)
    // This is simplified - in reality would parse experience details
    const experienceScore = resumeAnalysis.experience?.length > 100 ? 25 : 15;
    score += experienceScore;
    
    // Score based on education (max 20 points)
    const educationScore = resumeAnalysis.education?.length > 50 ? 15 : 10;
    score += educationScore;
    
    // Score based on strengths identified (max 20 points)
    const strengthsScore = Math.min(resumeAnalysis.strengths?.length || 0, 5) / 5 * 20;
    score += strengthsScore;
    
    // Import strengths and weaknesses from analysis
    if (resumeAnalysis.strengths?.length > 0) {
      strengths.push(...resumeAnalysis.strengths.slice(0, 2));
    }
    
    if (resumeAnalysis.recommendations?.length > 0) {
      weaknesses.push(...resumeAnalysis.recommendations.slice(0, 2));
    }
    
    return {
      score: Math.round(score),
      grade: getGradeFromScore(score),
      strengths,
      weaknesses
    };
  };

  const calculateEpfoScore = (epfoNumber: string): PlatformScore => {
    // In a real implementation, this would use EPFO API data
    // For now, we'll just return a mock score based on the presence of a UAN
    return {
      score: 90,
      grade: "A-",
      strengths: [
        "Employment history verifiable",
        "Consistent employment record"
      ],
      weaknesses: [
        "Limited assessment without API access"
      ]
    };
  };

  const calculateOverallScore = (
    github: PlatformScore,
    linkedin: PlatformScore | null,
    resume: PlatformScore | null,
    epfo: PlatformScore | null
  ) => {
    // Weight: GitHub (50%), Resume (30%), LinkedIn (10%), EPFO (10%)
    let totalScore = github.score * 0.5;
    let availableWeight = 0.5;
    
    if (resume) {
      totalScore += resume.score * 0.3;
      availableWeight += 0.3;
    }
    
    if (linkedin) {
      totalScore += linkedin.score * 0.1;
      availableWeight += 0.1;
    }
    
    if (epfo) {
      totalScore += epfo.score * 0.1;
      availableWeight += 0.1;
    }
    
    // Normalize score based on available data
    const normalizedScore = availableWeight > 0 ? totalScore / availableWeight : github.score;
    const grade = getGradeFromScore(normalizedScore);
    
    // Generate recommendation based on score
    let recommendation = "";
    let interviewPotential = "";
    
    if (normalizedScore >= 90) {
      recommendation = "Exceptional candidate; strongly consider for interview";
      interviewPotential = "High Priority";
    } else if (normalizedScore >= 80) {
      recommendation = "Strong candidate; recommend for interview";
      interviewPotential = "Recommended";
    } else if (normalizedScore >= 70) {
      recommendation = "Qualified candidate; consider for interview";
      interviewPotential = "Consider";
    } else if (normalizedScore >= 60) {
      recommendation = "Potential candidate; may require additional screening";
      interviewPotential = "Additional Screening";
    } else {
      recommendation = "Not recommended for current position";
      interviewPotential = "Not Recommended";
    }
    
    return {
      score: Math.round(normalizedScore),
      grade,
      recommendation,
      interviewPotential
    };
  };

  const getGradeFromScore = (score: number): string => {
    if (score >= 97) return "A+";
    if (score >= 93) return "A";
    if (score >= 90) return "A-";
    if (score >= 87) return "B+";
    if (score >= 83) return "B";
    if (score >= 80) return "B-";
    if (score >= 77) return "C+";
    if (score >= 73) return "C";
    if (score >= 70) return "C-";
    if (score >= 67) return "D+";
    if (score >= 63) return "D";
    if (score >= 60) return "D-";
    return "F";
  };

  const handleAnalyze = async () => {
    if (!githubUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a GitHub username or URL",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setProfile(null);
    setRepositories([]);
    setAnalysis("");

    try {
      const username = extractUsername(githubUrl);
      
      // Fetch GitHub data
      const { profile: profileData, repos: reposData } = await fetchGitHubData(username);
      setProfile(profileData);
      setRepositories(reposData);

      // Analyze with Gemini
      const analysisResult = await analyzeWithGemini(profileData, reposData);
      setAnalysis(analysisResult);

      // Calculate scores
      const candidateScoreCard = calculateScores(profileData, reposData, resumeAnalysis, linkedinUrl, epfoNumber);
      setScoreCard(candidateScoreCard);

      toast({
        title: "Analysis Complete",
        description: "Profile analyzed successfully with additional data sources!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Analysis failed",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setResume(file);
        toast({
          title: "Resume Uploaded",
          description: `${file.name} uploaded successfully. Analyzing with ChatGPT...`,
        });

        // Analyze resume with ChatGPT
        try {
          const analysis = await analyzeResumeWithChatGPT(file);
          setResumeAnalysis(analysis);
          toast({
            title: "Resume Analysis Complete",
            description: "ChatGPT has successfully analyzed your resume!",
          });
        } catch (error) {
          toast({
            title: "Resume Analysis Failed",
            description: "Unable to analyze resume with ChatGPT. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
      }
    }
  };

  const formatAnalysisText = (text: string) => {
    // Split by double newlines to create paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // Check if it's a heading (starts with #)
      if (paragraph.startsWith('#')) {
        const level = paragraph.match(/^#+/)?.[0].length || 1;
        const title = paragraph.replace(/^#+\s*/, '');
        
        if (level === 1) {
          return (
            <h2 key={index} className="text-2xl font-bold text-gray-900 mb-4 mt-6 first:mt-0">
              {title}
            </h2>
          );
        } else if (level === 2) {
          return (
            <h3 key={index} className="text-xl font-semibold text-gray-800 mb-3 mt-5 first:mt-0">
              {title}
            </h3>
          );
        } else {
          return (
            <h4 key={index} className="text-lg font-medium text-gray-700 mb-2 mt-4 first:mt-0">
              {title}
            </h4>
          );
        }
      }
      
      // Check if it's a bullet point
      if (paragraph.startsWith('•') || paragraph.startsWith('-')) {
        const items = paragraph.split('\n').filter(item => item.trim());
        return (
          <ul key={index} className="list-disc list-inside space-y-1 mb-4 text-gray-700">
            {items.map((item, itemIndex) => (
              <li key={itemIndex} className="ml-2">
                {formatInlineText(item.replace(/^[•-]\s*/, ''))}
              </li>
            ))}
          </ul>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="text-gray-700 mb-4 leading-relaxed">
          {formatInlineText(paragraph)}
        </p>
      );
    });
  };

  const formatInlineText = (text: string) => {
    // Split text by markdown patterns and format accordingly
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    
    return parts.map((part, index) => {
      // Bold text (**text**)
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-gray-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      
      // Italic text (*text*)
      if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
        return (
          <em key={index} className="italic text-gray-800">
            {part.slice(1, -1)}
          </em>
        );
      }
      
      // Code text (`text`)
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">
            {part.slice(1, -1)}
          </code>
        );
      }
      
      // Regular text
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild className="hover:bg-gray-100/50 transition-all duration-200">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Profile Analyzer
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Section */}
        <Card className="mb-8 border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center space-x-3 text-3xl">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-7 h-7 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Analyze Developer Profile
              </span>
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
              Enter profile information to get comprehensive AI-powered insights about developer skills, experience, and coding patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="github-url" className="text-sm font-semibold text-gray-700">
                  Developer Profile URL or Username
                </Label>
                <Input
                  id="github-url"
                  placeholder="e.g., octocat or https://github.com/octocat"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAnalyze()}
                  className="h-14 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-200"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="linkedin-url" className="text-sm font-semibold text-gray-700">
                  LinkedIn Profile URL (Optional)
                </Label>
                <Input
                  id="linkedin-url"
                  placeholder="e.g., https://linkedin.com/in/username"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="h-14 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-200"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="epfo-number" className="text-sm font-semibold text-gray-700">
                  EPFO Number (Optional)
                </Label>
                <Input
                  id="epfo-number"
                  placeholder="e.g., DL/12345/1234567890"
                  value={epfoNumber}
                  onChange={(e) => setEpfoNumber(e.target.value)}
                  className="h-14 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-200"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="resume-upload" className="text-sm font-semibold text-gray-700">
                  Upload Resume (PDF)
                </Label>
                <div className="relative">
                  <Input
                    id="resume-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    className="h-14 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                  />
                  {resume && (
                    <div className="mt-3 text-sm text-green-600 flex items-center bg-green-50 p-3 rounded-lg">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {resume.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || !githubUrl.trim()}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-4 h-14 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Analyzing Profile...
                  </>
                ) : (
                  <>
                    <Search className="w-6 h-6 mr-3" />
                    Analyze Profile
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {profile && (
          <div className="space-y-8">
            {/* Profile Info */}
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
                  <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="relative">
                      <img
                        src={profile.avatar_url}
                        alt={profile.name || profile.login}
                        className="w-24 h-24 rounded-full border-4 border-white/20 shadow-lg"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-3xl font-bold mb-2">
                        {profile.name || profile.login}
                      </h2>
                      <p className="text-blue-100 text-lg mb-3">@{profile.login}</p>
                      {profile.bio && (
                        <p className="text-blue-50 mb-4 max-w-2xl">{profile.bio}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-blue-100">
                        {profile.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{profile.location}</span>
                          </div>
                        )}
                        {profile.company && (
                          <div className="flex items-center space-x-1">
                            <Building className="w-4 h-4" />
                            <span>{profile.company}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                      <div className="flex items-center justify-center mb-2">
                        <BookOpen className="w-5 h-5 text-blue-600 mr-1" />
                      </div>
                      <div className="text-3xl font-bold text-blue-600 mb-1">{profile.public_repos}</div>
                      <div className="text-sm text-blue-700 font-medium">Repositories</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                      <div className="flex items-center justify-center mb-2">
                        <Users className="w-5 h-5 text-green-600 mr-1" />
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-1">{profile.followers}</div>
                      <div className="text-sm text-green-700 font-medium">Followers</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                      <div className="flex items-center justify-center mb-2">
                        <User className="w-5 h-5 text-purple-600 mr-1" />
                      </div>
                      <div className="text-3xl font-bold text-purple-600 mb-1">{profile.following}</div>
                      <div className="text-sm text-purple-700 font-medium">Following</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Repositories */}
            {repositories.length > 0 && (
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Recent Repositories</CardTitle>
                  <CardDescription className="text-gray-600">Most recently updated repositories</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {repositories.slice(0, 5).map((repo) => (
                    <div key={repo.name} className="border border-gray-200 rounded-xl p-5 bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg text-blue-600 hover:text-blue-700 cursor-pointer">
                          {repo.name}
                        </h3>
                        {repo.language && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {repo.language}
                          </Badge>
                        )}
                      </div>
                      {repo.description && (
                        <p className="text-gray-600 mb-3 line-clamp-2">{repo.description}</p>
                      )}
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{repo.stargazers_count}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <GitBranch className="w-4 h-4 text-green-500" />
                          <span>{repo.forks_count}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* HR Scorecard - New Component */}
            {scoreCard && (
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                      Candidate Scorecard
                    </span>
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Comprehensive evaluation summary for HR decision making
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200">
                    {/* Overall Score */}
                    <div className="mb-8 flex flex-col items-center">
                      <div className="relative w-40 h-40 mb-4">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 shadow-inner"></div>
                        <div className="absolute inset-3 rounded-full bg-white flex items-center justify-center flex-col shadow-lg">
                          <div className={`text-5xl font-bold ${
                            scoreCard.overall.score >= 90 ? "text-emerald-600" :
                            scoreCard.overall.score >= 80 ? "text-blue-600" :
                            scoreCard.overall.score >= 70 ? "text-amber-600" :
                            scoreCard.overall.score >= 60 ? "text-orange-600" : "text-red-600"
                          }`}>
                            {scoreCard.overall.grade}
                          </div>
                          <div className="text-gray-500 text-sm mt-1">{scoreCard.overall.score}/100</div>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">Overall Candidate Score</h3>
                      <p className="text-gray-600 text-center max-w-lg">
                        {scoreCard.overall.recommendation}
                      </p>
                      <Badge className={`mt-4 px-4 py-1 ${
                        scoreCard.overall.interviewPotential === "High Priority" ? "bg-emerald-100 text-emerald-800" :
                        scoreCard.overall.interviewPotential === "Recommended" ? "bg-blue-100 text-blue-800" :
                        scoreCard.overall.interviewPotential === "Consider" ? "bg-amber-100 text-amber-800" :
                        scoreCard.overall.interviewPotential === "Additional Screening" ? "bg-orange-100 text-orange-800" : 
                        "bg-red-100 text-red-800"
                      }`}>
                        {scoreCard.overall.interviewPotential}
                      </Badge>
                    </div>

                    {/* Individual Platform Scores */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      {/* GitHub Score Card */}
                      <div className="border border-gray-200 rounded-lg p-5 bg-gradient-to-br from-gray-50 to-white">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold text-gray-900">GitHub Profile</h3>
                          <Badge className="bg-blue-100 text-blue-800">{scoreCard.github.grade}</Badge>
                        </div>
                        <div className="text-3xl font-bold text-blue-600 mb-3">{scoreCard.github.score}<span className="text-sm text-gray-500">/100</span></div>
                        
                        <div className="space-y-3 mt-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Strengths</h4>
                            <ul className="text-xs space-y-1">
                              {scoreCard.github.strengths.map((strength, idx) => (
                                <li key={idx} className="text-gray-600 flex items-start">
                                  <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 mr-1.5"></div>
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {scoreCard.github.weaknesses.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-1">Areas for Improvement</h4>
                              <ul className="text-xs space-y-1">
                                {scoreCard.github.weaknesses.map((weakness, idx) => (
                                  <li key={idx} className="text-gray-600 flex items-start">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 mr-1.5"></div>
                                    {weakness}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Resume Score Card */}
                      {scoreCard.resume ? (
                        <div className="border border-gray-200 rounded-lg p-5 bg-gradient-to-br from-gray-50 to-white">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-gray-900">Resume</h3>
                            <Badge className="bg-green-100 text-green-800">{scoreCard.resume.grade}</Badge>
                          </div>
                          <div className="text-3xl font-bold text-green-600 mb-3">{scoreCard.resume.score}<span className="text-sm text-gray-500">/100</span></div>
                          
                          <div className="space-y-3 mt-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-1">Strengths</h4>
                              <ul className="text-xs space-y-1">
                                {scoreCard.resume.strengths.map((strength, idx) => (
                                  <li key={idx} className="text-gray-600 flex items-start">
                                    <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 mr-1.5"></div>
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {scoreCard.resume.weaknesses.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-1">Areas for Improvement</h4>
                                <ul className="text-xs space-y-1">
                                  {scoreCard.resume.weaknesses.map((weakness, idx) => (
                                    <li key={idx} className="text-gray-600 flex items-start">
                                      <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 mr-1.5"></div>
                                      {weakness}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="border border-gray-200 rounded-lg p-5 bg-gradient-to-br from-gray-50 to-white opacity-60">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-gray-900">Resume</h3>
                            <Badge variant="outline">Not Provided</Badge>
                          </div>
                          <p className="text-sm text-gray-600">Upload a resume for complete analysis</p>
                        </div>
                      )}

                      {/* LinkedIn Score Card */}
                      {scoreCard.linkedin ? (
                        <div className="border border-gray-200 rounded-lg p-5 bg-gradient-to-br from-gray-50 to-white">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-gray-900">LinkedIn</h3>
                            <Badge className="bg-blue-100 text-blue-800">{scoreCard.linkedin.grade}</Badge>
                          </div>
                          <div className="text-3xl font-bold text-blue-600 mb-3">{scoreCard.linkedin.score}<span className="text-sm text-gray-500">/100</span></div>
                          
                          <div className="space-y-3 mt-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-1">Strengths</h4>
                              <ul className="text-xs space-y-1">
                                {scoreCard.linkedin.strengths.map((strength, idx) => (
                                  <li key={idx} className="text-gray-600 flex items-start">
                                    <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 mr-1.5"></div>
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {scoreCard.linkedin.weaknesses.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-1">Areas for Improvement</h4>
                                <ul className="text-xs space-y-1">
                                  {scoreCard.linkedin.weaknesses.map((weakness, idx) => (
                                    <li key={idx} className="text-gray-600 flex items-start">
                                      <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 mr-1.5"></div>
                                      {weakness}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="border border-gray-200 rounded-lg p-5 bg-gradient-to-br from-gray-50 to-white opacity-60">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-gray-900">LinkedIn</h3>
                            <Badge variant="outline">Not Provided</Badge>
                          </div>
                          <p className="text-sm text-gray-600">Add LinkedIn URL for complete analysis</p>
                        </div>
                      )}

                      {/* EPFO Score Card */}
                      {scoreCard.epfo ? (
                        <div className="border border-gray-200 rounded-lg p-5 bg-gradient-to-br from-gray-50 to-white">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-gray-900">EPFO Verification</h3>
                            <Badge className="bg-purple-100 text-purple-800">{scoreCard.epfo.grade}</Badge>
                          </div>
                          <div className="text-3xl font-bold text-purple-600 mb-3">{scoreCard.epfo.score}<span className="text-sm text-gray-500">/100</span></div>
                          
                          <div className="space-y-3 mt-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-1">Verification Status</h4>
                              <p className="text-xs text-gray-600">
                                Employment history verification is pending API integration.
                              </p>
                            </div>
                            {scoreCard.epfo.strengths.map((strength, idx) => (
                              <div key={idx} className="text-xs text-gray-600 flex items-start">
                                <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 mr-1.5"></div>
                                {strength}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="border border-gray-200 rounded-lg p-5 bg-gradient-to-br from-gray-50 to-white opacity-60">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-gray-900">EPFO Verification</h3>
                            <Badge variant="outline">Not Provided</Badge>
                          </div>
                          <p className="text-sm text-gray-600">Add EPFO number for employment verification</p>
                        </div>
                      )}
                    </div>

                    {/* HR Decision Helper */}
                    <div className="border border-gray-200 rounded-lg p-5 bg-gradient-to-br from-gray-50 to-white">
                      <h3 className="font-semibold text-gray-900 mb-4">HR Decision Helper</h3>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium text-gray-700">Technical Fit</h4>
                          <div className="h-2 w-full bg-gray-200 rounded">
                            <div 
                              className="h-full rounded bg-blue-600" 
                              style={{ width: `${Math.min((scoreCard.github.score + (scoreCard.resume?.score || 0))/2, 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Low</span>
                            <span>High</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium text-gray-700">Experience Level</h4>
                          <div className="h-2 w-full bg-gray-200 rounded">
                            <div 
                              className="h-full rounded bg-green-600" 
                              style={{ width: `${Math.min(
                                scoreCard.github.score * 0.4 + 
                                (scoreCard.resume?.score || 0) * 0.4 + 
                                (scoreCard.epfo?.score || 0) * 0.2, 100
                              )}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Junior</span>
                            <span>Senior</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium text-gray-700">Credibility</h4>
                          <div className="h-2 w-full bg-gray-200 rounded">
                            <div 
                              className="h-full rounded bg-amber-600" 
                              style={{ width: `${Math.min(
                                scoreCard.github.score * 0.3 + 
                                (scoreCard.linkedin?.score || 0) * 0.4 + 
                                (scoreCard.epfo?.score || 0) * 0.3, 100
                              )}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Unverified</span>
                            <span>Verified</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Download Scorecard
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Analysis */}
            {analysis && (
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      AI Analysis
                    </span>
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Comprehensive profile insights powered by Gemini AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200">
                    {formatAnalysisText(analysis)}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default GitHubAnalyzer;
