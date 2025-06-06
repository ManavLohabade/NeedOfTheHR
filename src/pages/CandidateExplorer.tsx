
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Star, GitBranch, Users, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CandidateExplorer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score");

  const candidates = [
    {
      id: 1,
      username: "johndoe",
      name: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe",
      score: 95,
      skills: ["React", "TypeScript", "Node.js", "AWS"],
      repos: 42,
      stars: 1250,
      followers: 89,
      location: "San Francisco, CA",
      bio: "Full-stack developer passionate about modern web technologies",
      languages: ["JavaScript", "TypeScript", "Python"]
    },
    {
      id: 2,
      username: "sarahsmith",
      name: "Sarah Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarahsmith",
      score: 92,
      skills: ["Python", "Machine Learning", "Docker", "Kubernetes"],
      repos: 38,
      stars: 890,
      followers: 156,
      location: "New York, NY",
      bio: "ML Engineer with expertise in deep learning and cloud infrastructure",
      languages: ["Python", "R", "Go"]
    },
    {
      id: 3,
      username: "mikejohnson",
      name: "Mike Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mikejohnson",
      score: 88,
      skills: ["Java", "Spring", "AWS", "PostgreSQL"],
      repos: 35,
      stars: 650,
      followers: 78,
      location: "Austin, TX",
      bio: "Backend engineer specializing in scalable enterprise applications",
      languages: ["Java", "Kotlin", "SQL"]
    },
    {
      id: 4,
      username: "emilychen",
      name: "Emily Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emilychen",
      score: 90,
      skills: ["React", "Vue.js", "CSS", "UI/UX"],
      repos: 28,
      stars: 420,
      followers: 92,
      location: "Seattle, WA",
      bio: "Frontend developer with a passion for creating beautiful user experiences",
      languages: ["JavaScript", "TypeScript", "CSS"]
    },
    {
      id: 5,
      username: "davidwilson",
      name: "David Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=davidwilson",
      score: 86,
      skills: ["Python", "Django", "Redis", "Celery"],
      repos: 31,
      stars: 580,
      followers: 64,
      location: "Boston, MA",
      bio: "Python developer focused on building robust web applications",
      languages: ["Python", "JavaScript", "Shell"]
    }
  ];

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLanguage = languageFilter === "all" || 
                           candidate.languages.some(lang => lang.toLowerCase() === languageFilter.toLowerCase());
    
    return matchesSearch && matchesLanguage;
  });

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    switch (sortBy) {
      case "score":
        return b.score - a.score;
      case "stars":
        return b.stars - a.stars;
      case "repos":
        return b.repos - a.repos;
      case "followers":
        return b.followers - a.followers;
      default:
        return 0;
    }
  });

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
              <h1 className="text-xl font-bold text-gray-900">Candidate Explorer</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2 text-blue-600" />
              Search & Filter Candidates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search by name, username, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Talent Score</SelectItem>
                  <SelectItem value="stars">GitHub Stars</SelectItem>
                  <SelectItem value="repos">Repository Count</SelectItem>
                  <SelectItem value="followers">Followers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold text-blue-600">{sortedCandidates.length}</span> candidates
          </p>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedCandidates.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={candidate.avatar}
                    alt={candidate.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                        <p className="text-sm text-gray-600">@{candidate.username}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        Score: {candidate.score}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{candidate.bio}</p>
                    
                    {candidate.location && (
                      <p className="text-xs text-gray-500 mb-3">{candidate.location}</p>
                    )}

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {candidate.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{candidate.skills.length - 4} more
                        </Badge>
                      )}
                    </div>

                    {/* GitHub Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <GitBranch className="w-4 h-4" />
                          <span>{candidate.repos} repos</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>{candidate.stars} stars</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{candidate.followers} followers</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/candidate/${candidate.username}`}>
                            View Profile
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href={`https://github.com/${candidate.username}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedCandidates.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No candidates found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default CandidateExplorer;
