
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CandidateExplorer from "./pages/CandidateExplorer";
import CandidateProfile from "./pages/CandidateProfile";
import JobDescriptionUpload from "./pages/JobDescriptionUpload";
import Login from "./pages/Login";
import GitHubAnalyzer from "./pages/GitHubAnalyzer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/analyzer" element={<GitHubAnalyzer />} />
          <Route path="/candidates" element={<CandidateExplorer />} />
          <Route path="/candidate/:username" element={<CandidateProfile />} />
          <Route path="/upload" element={<JobDescriptionUpload />} />
          <Route path="/login" element={<Login />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
