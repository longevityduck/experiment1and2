
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ConfidenceAssessment from "./pages/ConfidenceAssessment";
import PersonalInfo from "./pages/PersonalInfo";
import CareerGoals from "./pages/CareerGoals";
import CareerGuidance from "./pages/CareerGuidance";
import WhatRole from "./pages/WhatRole";
import CareerGoalSuggestion from "./pages/CareerGoalSuggestion";
import CareerConfidenceAssessment from "./pages/CareerConfidenceAssessment";
import EntrepreneurshipResources from "./pages/EntrepreneurshipResources";
import NextSteps from "./pages/NextSteps";
import ReviewCareerSteps from "./pages/ReviewCareerSteps";
import SavedResults from "./pages/SavedResults";
import NotFound from "./pages/NotFound";
import Success from "./pages/Success";

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
          <Route path="/" element={<Navigate to="/confidence-assessment" replace />} />
          <Route path="/confidence-assessment" element={<ConfidenceAssessment />} />
          <Route path="/personal-info" element={<PersonalInfo />} />
          <Route path="/career-goals" element={<CareerGoals />} />
          <Route path="/career-guidance" element={<CareerGuidance />} />
          <Route path="/what-role" element={<WhatRole />} />
          <Route path="/career-goal-suggestion" element={<CareerGoalSuggestion />} />
          <Route path="/career-confidence-assessment" element={<CareerConfidenceAssessment />} />
          <Route path="/entrepreneurship-resources" element={<EntrepreneurshipResources />} />
          <Route path="/next-steps" element={<NextSteps />} />
          <Route path="/review-career-steps" element={<ReviewCareerSteps />} />
          <Route path="/saved-results" element={<SavedResults />} />
          <Route path="/success" element={<Success />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
