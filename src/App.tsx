import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Introduction from "./pages/Introduction";
import UserType from "./pages/UserType";
import Login from "./pages/Login";
import ReturningUserOptions from "./pages/ReturningUserOptions";
import CurrentGoal from "./pages/CurrentGoal";
import PersonalInfo from "./pages/PersonalInfo";
import CareerGoals from "./pages/CareerGoals";
import CareerGuidance from "./pages/CareerGuidance";
import WhatRole from "./pages/WhatRole";
import CareerClarification from "./pages/CareerClarification";
import CareerGoalSuggestion from "./pages/CareerGoalSuggestion";
import SkillsAssessment from "./pages/SkillsAssessment";
import NextSteps from "./pages/NextSteps";
import PhoneCommitment from "./pages/PhoneCommitment";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";
import EntrepreneurshipResources from "./pages/EntrepreneurshipResources";

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
          <Route path="/" element={<Navigate to="/introduction" replace />} />
          <Route path="/introduction" element={<Introduction />} />
          <Route path="/user-type" element={<UserType />} />
          <Route path="/login" element={<Login />} />
          <Route path="/returning-user-options" element={<ReturningUserOptions />} />
          <Route path="/current-goal" element={<CurrentGoal />} />
          <Route path="/personal-info" element={<PersonalInfo />} />
          <Route path="/career-goals" element={<CareerGoals />} />
          <Route path="/career-guidance" element={<CareerGuidance />} />
          <Route path="/what-role" element={<WhatRole />} />
          <Route path="/career-clarification" element={<CareerClarification />} />
          <Route path="/career-goal-suggestion" element={<CareerGoalSuggestion />} />
          <Route path="/skills-assessment" element={<SkillsAssessment />} />
          <Route path="/next-steps" element={<NextSteps />} />
          <Route path="/phone-commitment" element={<PhoneCommitment />} />
          <Route path="/success" element={<Success />} />
          <Route path="/entrepreneurship-resources" element={<EntrepreneurshipResources />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;