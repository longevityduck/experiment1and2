
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepsList from "@/components/next-steps/StepsList";
import ActionButtons from "@/components/next-steps/ActionButtons";
import { FormContainer } from "@/components/career-guidance/FormContainer";
import { ProgressIndicator } from "@/components/career-guidance/ProgressIndicator";
import LoadingState from "@/components/next-steps/LoadingState";
import StepsGenerator from "@/components/next-steps/StepsGenerator";
import { Step } from "@/types/steps";

const NextSteps = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<Step[]>([]);
  const [editingContent, setEditingContent] = useState("");
  const [editingTimeframe, setEditingTimeframe] = useState("");

  const handleReset = () => {
    localStorage.removeItem("careerInfo");
    localStorage.removeItem("careerGoals");
    localStorage.removeItem("skills");
    localStorage.removeItem("guidanceAnswers");
    localStorage.removeItem("clarificationAnswers");
    navigate("/");
  };

  const handleCommit = () => {
    navigate("/phone-commitment");
  };

  return (
    <>
      <ProgressIndicator />
      <FormContainer title="Your Career Plan">
        {loading ? (
          <>
            <LoadingState />
            <StepsGenerator
              onStepsGenerated={setSteps}
              setLoading={setLoading}
            />
          </>
        ) : (
          <>
            <div className="text-sm text-gray-600 space-y-2 mb-6">
              <p>Based on your responses and career goals, we've created a personalized career plan that we think will help you achieve your objectives.</p>
              <p>Feel free to modify these steps to better align with your preferences and circumstances.</p>
              <p className="text-sm text-gray-600 mt-4">
                Want to learn more about career planning? Watch this helpful{" "}
                <a 
                  href="https://www.youtube.com/watch?v=josBNfsFtU4" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 font-medium underline"
                >
                  video guide on setting a career plan
                </a>
                .
              </p>
            </div>
            <StepsList
              steps={steps}
              setSteps={setSteps}
              editingContent={editingContent}
              editingTimeframe={editingTimeframe}
              setEditingContent={setEditingContent}
              setEditingTimeframe={setEditingTimeframe}
            />
            <ActionButtons onReset={handleReset} onCommit={handleCommit} />
          </>
        )}
      </FormContainer>
    </>
  );
};

export default NextSteps;
