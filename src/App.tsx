
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import PasswordAuth from "./pages/PasswordAuth";
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

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Main app component with routes
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={isAuthenticated ? <Navigate to="/" replace /> : <PasswordAuth />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Navigate to="/confidence-assessment" replace />
          </ProtectedRoute>
        } />
        
        <Route path="/confidence-assessment" element={
          <ProtectedRoute>
            <ConfidenceAssessment />
          </ProtectedRoute>
        } />
        
        <Route path="/personal-info" element={
          <ProtectedRoute>
            <PersonalInfo />
          </ProtectedRoute>
        } />
        
        <Route path="/career-goals" element={
          <ProtectedRoute>
            <CareerGoals />
          </ProtectedRoute>
        } />
        
        <Route path="/career-guidance" element={
          <ProtectedRoute>
            <CareerGuidance />
          </ProtectedRoute>
        } />
        
        <Route path="/what-role" element={
          <ProtectedRoute>
            <WhatRole />
          </ProtectedRoute>
        } />
        
        <Route path="/career-goal-suggestion" element={
          <ProtectedRoute>
            <CareerGoalSuggestion />
          </ProtectedRoute>
        } />
        
        <Route path="/career-confidence-assessment" element={
          <ProtectedRoute>
            <CareerConfidenceAssessment />
          </ProtectedRoute>
        } />
        
        <Route path="/entrepreneurship-resources" element={
          <ProtectedRoute>
            <EntrepreneurshipResources />
          </ProtectedRoute>
        } />
        
        <Route path="/next-steps" element={
          <ProtectedRoute>
            <NextSteps />
          </ProtectedRoute>
        } />
        
        <Route path="/review-career-steps" element={
          <ProtectedRoute>
            <ReviewCareerSteps />
          </ProtectedRoute>
        } />
        
        <Route path="/success" element={
          <ProtectedRoute>
            <Success />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
