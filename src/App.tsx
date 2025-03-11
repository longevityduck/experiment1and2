
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PersonalInfo from "./pages/PersonalInfo";
import CareerGoals from "./pages/CareerGoals";
import CareerGuidance from "./pages/CareerGuidance";
import WhatRole from "./pages/WhatRole";
import CareerClarification from "./pages/CareerClarification";
import CareerGoalSuggestion from "./pages/CareerGoalSuggestion";
import EntrepreneurshipResources from "./pages/EntrepreneurshipResources";
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
          <Route path="/" element={<Navigate to="/personal-info" replace />} />
          <Route path="/personal-info" element={<PersonalInfo />} />
          <Route path="/career-goals" element={<CareerGoals />} />
          <Route path="/career-guidance" element={<CareerGuidance />} />
          <Route path="/what-role" element={<WhatRole />} />
          <Route path="/career-clarification" element={<CareerClarification />} />
          <Route path="/career-goal-suggestion" element={<CareerGoalSuggestion />} />
          <Route path="/entrepreneurship-resources" element={<EntrepreneurshipResources />} />
          <Route path="/success" element={<Success />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
