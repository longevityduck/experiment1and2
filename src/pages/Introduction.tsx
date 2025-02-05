import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const Introduction = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 sm:p-6">
      <Header />
      <div className="max-w-2xl mx-auto pt-8 sm:pt-12">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 text-center space-y-4 sm:space-y-6">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
              Stop feeling lost
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700">
              Get a clear career roadmap in 5 minutes
            </p>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
            Welcome to Own Goal
          </h1>
          
          <div className="space-y-4 text-base sm:text-lg text-gray-600">
            <p>
              Your journey to career success starts here. Own Goal is your personal
              guide to effective career planning and goal achievement.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg my-6">
              <p className="text-gray-700">
                Developed by professional career coaches and grounded in proven career development principles, 
                Own Goal combines decades of coaching expertise with cutting-edge AI technology to provide 
                you with personalized, actionable career guidance.
              </p>
            </div>

            <div className="py-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                What You'll Get:
              </h2>
              <ul className="space-y-2 text-left list-disc list-inside px-2">
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

          <div className="mt-6 sm:mt-8">
            <Button 
              onClick={() => {
                localStorage.clear();
                navigate("/user-type");
              }}
              className="px-4 sm:px-8 py-4 sm:py-6 text-base sm:text-lg w-full sm:w-auto"
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