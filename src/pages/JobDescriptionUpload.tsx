
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, FileText, Zap, Users, CheckCircle, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const JobDescriptionUpload = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matches, setMatches] = useState([]);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setMatches([
        {
          id: 1,
          username: "johndoe",
          name: "John Doe",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe",
          matchScore: 95,
          skills: ["React", "TypeScript", "Node.js", "AWS"],
          repos: 42,
          stars: 1250,
          followers: 89,
          matchReasons: [
            "Strong TypeScript experience (3+ years)",
            "React expertise with 15+ projects",
            "AWS cloud architecture experience",
            "Full-stack development background"
          ]
        },
        {
          id: 2,
          username: "sarahsmith",
          name: "Sarah Smith",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarahsmith",
          matchScore: 88,
          skills: ["Python", "React", "Docker", "PostgreSQL"],
          repos: 38,
          stars: 890,
          followers: 156,
          matchReasons: [
            "Full-stack development experience",
            "Docker containerization skills",
            "Database design expertise",
            "Agile development practices"
          ]
        },
        {
          id: 3,
          username: "mikejohnson",
          name: "Mike Johnson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mikejohnson",
          matchScore: 82,
          skills: ["JavaScript", "React", "Node.js", "MongoDB"],
          repos: 35,
          stars: 650,
          followers: 78,
          matchReasons: [
            "JavaScript proficiency",
            "React component development",
            "RESTful API development",
            "NoSQL database experience"
          ]
        }
      ]);
      setIsAnalyzing(false);
      setAnalyzed(true);
    }, 3000);
  };

  const sampleJD = `Senior Full-Stack Developer - Remote

We're looking for an experienced Full-Stack Developer to join our growing team. The ideal candidate will have:

Requirements:
• 3+ years of experience with React and TypeScript
• Strong backend development skills with Node.js
• Experience with cloud platforms (AWS preferred)
• Knowledge of database design (PostgreSQL, MongoDB)
• Familiarity with Docker and containerization
• Experience with Agile development methodologies
• Excellent problem-solving and communication skills

Responsibilities:
• Develop and maintain web applications using React and TypeScript
• Build scalable backend APIs with Node.js
• Collaborate with design and product teams
• Participate in code reviews and technical discussions
• Mentor junior developers

Nice to have:
• Experience with GraphQL
• DevOps and CI/CD pipeline knowledge
• Open source contributions
• Previous startup experience`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-xl font-bold text-gray-900">AI Job Matching</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Job Description Input */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Job Description
                </CardTitle>
                <CardDescription>
                  Paste your job description below and our AI will find the best matching candidates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[300px] resize-none"
                />
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleAnalyze}
                    disabled={!jobDescription.trim() || isAnalyzing}
                    className="flex-1"
                  >
                    {isAnalyzing ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Find Matches
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setJobDescription(sampleJD)}
                  >
                    Use Sample
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* How it works */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How AI Matching Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Skill Extraction</h4>
                    <p className="text-sm text-gray-600">AI analyzes your job description to identify required skills and technologies</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">GitHub Analysis</h4>
                    <p className="text-sm text-gray-600">Matches requirements against candidate GitHub profiles and repositories</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Smart Ranking</h4>
                    <p className="text-sm text-gray-600">Candidates are ranked by compatibility and experience level</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {isAnalyzing && (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold mb-2">Analyzing Job Description</h3>
                  <p className="text-gray-600">Our AI is processing your requirements and matching with candidates...</p>
                  <div className="mt-4 space-y-2">
                    <Progress value={33} className="h-2" />
                    <div className="text-sm text-gray-500">Extracting skills and requirements...</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {analyzed && matches.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Top Candidate Matches
                  </CardTitle>
                  <CardDescription>
                    Found {matches.length} highly compatible candidates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {matches.map((candidate) => (
                    <div key={candidate.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-4">
                        <img
                          src={candidate.avatar}
                          alt={candidate.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                              <p className="text-sm text-gray-600">@{candidate.username}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              {candidate.matchScore}% Match
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-3">
                            {candidate.skills.slice(0, 4).map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-900 mb-1">Why this candidate matches:</h4>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {candidate.matchReasons.slice(0, 2).map((reason, index) => (
                                <li key={index} className="flex items-center space-x-1">
                                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-gray-600">
                              <span>{candidate.repos} repos</span>
                              <span>{candidate.stars} stars</span>
                              <span>{candidate.followers} followers</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" asChild>
                                <Link to={`/candidate/${candidate.username}`}>
                                  View Profile
                                </Link>
                              </Button>
                              <Button size="sm">
                                Contact
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {!analyzed && !isAnalyzing && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Find Perfect Candidates?</h3>
                  <p className="text-gray-600 mb-4">
                    Upload your job description and let our AI find the best matching developers from GitHub
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>Smart AI matching</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span>GitHub verified skills</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-purple-500" />
                      <span>Instant results</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDescriptionUpload;
