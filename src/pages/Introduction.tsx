
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const Introduction = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/80 to-white">
      <Header />
      <main className="px-4 py-8 sm:py-12 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            {/* Main headline section */}
            <div className="space-y-2 text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                Stop feeling lost
              </h2>
              <p className="text-lg sm:text-xl text-gray-600">
                Get a clear career roadmap in 15 minutes
              </p>
            </div>

            {/* Welcome section */}
            <div className="space-y-6">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center">
                Welcome to North Star
              </h1>
              
              <p className="text-gray-600 leading-relaxed">
                North Star is your personal career guide, designed to support your reflection, 
                clarify your path, and help you achieve your goals.
              </p>
              
              {/* Info box */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                <p className="text-gray-700">
                  Developed by professional career coaches and grounded in proven career development principles, 
                  North Star combines decades of coaching expertise with cutting-edge AI technology to provide 
                  you with personalized, actionable career guidance.
                </p>
              </div>

              {/* Features section */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-800">
                  What You'll Get:
                </h2>
                <ul className="space-y-2 text-gray-600 list-disc list-inside">
                  <li>Personalized career goal suggestions</li>
                  <li>Skills assessment and development plans</li>
                  <li>Actionable next steps for your career journey</li>
                  <li>Regular updates and insights to keep you on track</li>
                </ul>
              </div>

              {/* Quote */}
              <p className="text-gray-600 italic text-center border-t border-gray-100 pt-6">
                "The best way to predict your future is to create it."
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-4 flex justify-center">
              <Button 
                onClick={() => {
                  localStorage.clear();
                  navigate("/user-type");
                }}
                className="px-6 py-3 text-base bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Start Your Career Planning Journey
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Introduction;
