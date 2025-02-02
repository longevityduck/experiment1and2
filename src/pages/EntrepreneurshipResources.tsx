import { useNavigate } from "react-router-dom";
import { FormContainer } from "@/components/career-guidance/FormContainer";
import { NavigationButtons } from "@/components/career-guidance/NavigationButtons";

const EntrepreneurshipResources = () => {
  const navigate = useNavigate();

  return (
    <FormContainer title="Entrepreneurship Resources">
      <div className="space-y-6">
        <p className="text-gray-700">
          We noticed that your goal is to start and run your own business. North Star might not be specifically designed for entrepreneurship.
        </p>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Entrepreneurship Resources</h2>
            <p className="text-gray-700 mb-4">
              We recommend checking out these valuable resources for aspiring entrepreneurs:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <a 
                  href="https://ace.sg/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Action Community for Entrepreneurship (ACE)
                </a>
              </li>
              <li>
                <a 
                  href="https://www.gobusiness.gov.sg/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  GoBusiness Singapore
                </a>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Continue with Career Guidance</h2>
            <p className="text-gray-700">
              You can still continue with North Star to explore additional insights and perspectives that might be valuable for your entrepreneurial journey.
            </p>
          </div>
        </div>

        <NavigationButtons
          onBack={() => navigate(-1)}
          onNext={() => navigate("/career-clarification")}
          nextButtonText="Continue with North Star"
        />
      </div>
    </FormContainer>
  );
};

export default EntrepreneurshipResources;