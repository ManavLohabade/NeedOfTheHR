
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, GitBranch, Users, Calendar, ExternalLink, Activity, MapPin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CandidateProfile = () => {
  const { username } = useParams();
  
  // Mock data - in a real app, this would come from GitHub API
  const candidate = {
    username: "johndoe",
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe",
    bio: "Full-stack developer passionate about modern web technologies. Love building scalable applications and contributing to open source.",
    location: "San Francisco, CA",
    email: "john.doe@example.com",
    company: "@TechCorp",
    website: "https://johndoe.dev",
    joinedDate: "2019-03-15",
    score: 95,
    publicRepos: 42,
    totalStars: 1250,
    followers: 89,
    following: 156,
    contributions: 2847,
    languages: [
      { name: "JavaScript", percentage: 45, color: "#f1e05a" },
      { name: "TypeScript", percentage: 30, color: "#2b7489" },
      { name: "Python", percentage: 15, color: "#3572A5" },
      { name: "CSS", percentage: 10, color: "#563d7c" }
    ],
    skills: ["React", "TypeScript", "Node.js", "AWS", "Docker", "PostgreSQL", "Redis", "GraphQL"],
    topRepos: [
      {
        name: "awesome-react-components",
        description: "A collection of reusable React components with TypeScript support",
        language: "TypeScript",
        stars: 423,
        forks: 67,
        updatedAt: "2024-05-20"
      },
      {
        name: "node-microservices",
        description: "Scalable microservices architecture built with Node.js and Docker",
        language: "JavaScript",
        stars: 289,
        forks: 45,
        updatedAt: "2024-05-18"
      },
      {
        name: "ml-dashboard",
        description: "Interactive dashboard for machine learning model monitoring",
        language: "Python",
        stars: 156,
        forks: 23,
        updatedAt: "2024-05-15"
      },
      {
        name: "css-animations",
        description: "Modern CSS animations and transitions library",
        language: "CSS",
        stars: 98,
        forks: 12,
        updatedAt: "2024-05-10"
      }
    ],
    contributionStats: {
      thisWeek: 12,
      thisMonth: 67,
      thisYear: 834,
      bestStreak: 45
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/candidates">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Explorer
                </Link>
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Candidate Profile</h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <a href={`https://github.com/${candidate.username}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on GitHub
                </a>
              </Button>
              <Button>Contact Candidate</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
              <img
                src={candidate.avatar}
                alt={candidate.name}
                className="w-32 h-32 rounded-full mx-auto md:mx-0"
              />
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{candidate.name}</h1>
                    <p className="text-lg text-gray-600">@{candidate.username}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2 mx-auto md:mx-0">
                    Talent Score: {candidate.score}
                  </Badge>
                </div>
                
                <p className="text-gray-700 mb-4 max-w-2xl">{candidate.bio}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {candidate.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{candidate.location}</span>
                    </div>
                  )}
                  {candidate.email && (
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{candidate.email}</span>
                    </div>
                  )}
                  {candidate.company && (
                    <div className="flex items-center space-x-1">
                      <span>Works at {candidate.company}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined GitHub {new Date(candidate.joinedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GitHub Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <GitBranch className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{candidate.publicRepos}</div>
              <div className="text-sm text-gray-600">Public Repos</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">{candidate.totalStars}</div>
              <div className="text-sm text-gray-600">Total Stars</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{candidate.followers}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <Activity className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{candidate.contributions}</div>
              <div className="text-sm text-gray-600">Contributions</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <Tabs defaultValue="repos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="repos">Top Repositories</TabsTrigger>
            <TabsTrigger value="skills">Skills & Languages</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="repos">
            <div className="grid gap-4">
              {candidate.topRepos.map((repo) => (
                <Card key={repo.name} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer">
                          {repo.name}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">{repo.description}</p>
                      </div>
                      <Badge variant="outline">{repo.language}</Badge>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{repo.stars}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <GitBranch className="w-4 h-4" />
                        <span>{repo.forks} forks</span>
                      </div>
                      <span>Updated {new Date(repo.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Programming Languages</CardTitle>
                  <CardDescription>Based on GitHub repository analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {candidate.languages.map((lang) => (
                    <div key={lang.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{lang.name}</span>
                        <span>{lang.percentage}%</span>
                      </div>
                      <Progress value={lang.percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Technical Skills</CardTitle>
                  <CardDescription>Extracted from repositories and contributions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contribution Statistics</CardTitle>
                  <CardDescription>GitHub activity breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>This Week</span>
                    <span className="font-semibold">{candidate.contributionStats.thisWeek} contributions</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Month</span>
                    <span className="font-semibold">{candidate.contributionStats.thisMonth} contributions</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Year</span>
                    <span className="font-semibold">{candidate.contributionStats.thisYear} contributions</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Best Streak</span>
                    <span className="font-semibold">{candidate.contributionStats.bestStreak} days</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Activity Level</CardTitle>
                  <CardDescription>Overall engagement assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Commit Frequency</span>
                        <span>Very High</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Code Quality</span>
                        <span>Excellent</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Community Engagement</span>
                        <span>High</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Candidate Analysis</CardTitle>
                <CardDescription>Comprehensive evaluation based on GitHub data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Strengths</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Consistently high-quality code with excellent documentation practices</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Strong expertise in modern web technologies and best practices</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Active contributor to open source community with growing influence</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Demonstrates continuous learning and adaptation to new technologies</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Areas for Growth</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <span>Could benefit from more diverse project types to showcase versatility</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <span>Limited experience with mobile development frameworks</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Recommended Roles</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-100 text-blue-800">Senior Full-Stack Developer</Badge>
                    <Badge className="bg-blue-100 text-blue-800">Frontend Team Lead</Badge>
                    <Badge className="bg-blue-100 text-blue-800">Technical Architect</Badge>
                    <Badge className="bg-blue-100 text-blue-800">Open Source Advocate</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CandidateProfile;
