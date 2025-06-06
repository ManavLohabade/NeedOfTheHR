import { Link } from "react-router-dom";
import { Users, Zap, Shield, BarChart3, Search, Code, Sparkles, Rocket, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                NeedOfTheHR
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/analyzer" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105 transform">
                Analyze
              </Link>
              <Link to="/candidates" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105 transform">
                Candidates
              </Link>
              <Link to="/upload" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105 transform">
                Job Matching
              </Link>
            </nav>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full text-blue-700 text-sm font-medium mb-8">
              <Rocket className="w-4 h-4 mr-2" />
              AI-Powered Talent Intelligence
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Discover
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"> Exceptional</span>
            <br />
            Developer Talent
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform your hiring process with intelligent profile analysis, comprehensive skill assessment, and data-driven talent insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <Link to="/analyzer">
                <Search className="w-5 h-5 mr-2" />
                Start Analyzing
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-8 py-4 text-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105">
              <Link to="/candidates">
                <Users className="w-5 h-5 mr-2" />
                Explore Candidates
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Search className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Smart Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 text-base leading-relaxed">
                AI-powered deep dive into developer profiles, skills, and contribution patterns with comprehensive scoring algorithms.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Data Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 text-base leading-relaxed">
                Comprehensive scorecards with technical skills, experience levels, and detailed recommendations for informed hiring decisions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Perfect Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 text-base leading-relaxed">
                Advanced algorithms match candidates to job requirements with precision, saving time and improving hire quality.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white mb-20 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Trusted by Forward-Thinking Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">10K+</div>
              <div className="text-blue-100 text-lg">Profiles Analyzed</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">95%</div>
              <div className="text-blue-100 text-lg">Accuracy Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">50%</div>
              <div className="text-blue-100 text-lg">Faster Hiring</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of companies already using NeedOfTheHR to find exceptional developer talent.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <Link to="/analyzer">
              <Zap className="w-5 h-5 mr-2" />
              Get Started Now
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
