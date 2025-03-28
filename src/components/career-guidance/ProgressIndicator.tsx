
import { useLocation } from "react-router-dom";

const routes = [
  { path: "/confidence-assessment", step: 1, label: "Confidence Assessment" },
  { path: "/personal-info", step: 2, label: "Personal Info" },
  { path: "/career-goals", step: 3, label: "Career Goals" },
  { path: "/career-guidance", step: 4, label: "Career Guidance" },
  { path: "/what-role", step: 5, label: "Role Selection" },
  { path: "/career-goal-suggestion", step: 6, label: "Goal Suggestion" },
  { path: "/career-confidence-assessment", step: 7, label: "Final Assessment" },
  { path: "/entrepreneurship-resources", step: 8, label: "Resources" },
  { path: "/success", step: 9, label: "Success" },
];

export const ProgressIndicator = () => {
  const location = useLocation();
  const currentRoute = routes.find(route => route.path === location.pathname);
  
  if (!currentRoute) return null;
  
  const progress = (currentRoute.step / routes.length) * 100;
  const progressPercentage = Math.round(progress);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">{progressPercentage}% Complete</span>
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
