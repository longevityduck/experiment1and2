import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PersonalInfo from "./pages/PersonalInfo";
import CareerGoals from "./pages/CareerGoals";
import CareerGuidance from "./pages/CareerGuidance";
import CareerClarification from "./pages/CareerClarification";
import SkillsAssessment from "./pages/SkillsAssessment";
import NextSteps from "./pages/NextSteps";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/personal-info" replace />} />
          <Route path="/personal-info" element={<PersonalInfo />} />
          <Route path="/career-goals" element={<CareerGoals />} />
          <Route path="/career-guidance" element={<CareerGuidance />} />
          <Route path="/career-clarification" element={<CareerClarification />} />
          <Route path="/skills-assessment" element={<SkillsAssessment />} />
          <Route path="/next-steps" element={<NextSteps />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;