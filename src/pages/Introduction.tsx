import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Introduction = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto pt-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Welcome to North Star
          </h1>
          
          <div className="space-y-4 text-lg text-gray-600">
            <p>
              Your journey to career success starts here. North Star is your personal
              guide to effective career planning and goal achievement.
            </p>
            
            <p>
              We believe that successful careers don't happen by chance - they're
              built through intentional planning, consistent effort, and the right
              guidance.
            </p>

            <div className="py-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                What You'll Get:
              </h2>
              <ul className="space-y-2 text-left list-disc list-inside">
                <li>Personalized career goal suggestions</li>
                <li>Skills assessment and development plans</li>
                <li>Actionable next steps for your career journey</li>
                <li>Regular updates and insights to keep you on track</li>
              </ul>
            </div>

            <p className="italic">
              "The best way to predict your future is to create it."
            </p>
          </div>

          <div className="mt-8">
            <Button 
              onClick={() => navigate("/personal-info")}
              className="px-8 py-6 text-lg"
            >
              Start Your Career Planning Journey
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;