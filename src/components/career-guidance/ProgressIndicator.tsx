import { useLocation } from "react-router-dom";

const routes = [
  { path: "/introduction", step: 1, label: "Introduction" },
  { path: "/user-type", step: 2, label: "User Type" },
  { path: "/login", step: 3, label: "Login" },
  { path: "/personal-info", step: 4, label: "Personal Info" },
  { path: "/career-goals", step: 5, label: "Career Goals" },
  { path: "/career-guidance", step: 6, label: "Career Guidance" },
  { path: "/career-clarification", step: 7, label: "Career Clarification" },
  { path: "/career-goal-suggestion", step: 8, label: "Goal Suggestion" },
  { path: "/skills-assessment", step: 9, label: "Skills" },
  { path: "/next-steps", step: 10, label: "Next Steps" },
  { path: "/phone-commitment", step: 11, label: "Commitment" },
  { path: "/success", step: 12, label: "Success" },
];

export const ProgressIndicator = () => {
  const location = useLocation();
  const currentRoute = routes.find(route => route.path === location.pathname);
  
  if (!currentRoute) return null;
  
  const progress = (currentRoute.step / routes.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">Step {currentRoute.step} of {routes.length}</span>
        <span className="text-sm text-gray-600">{currentRoute.label}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};