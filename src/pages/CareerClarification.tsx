
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FormContainer } from "@/components/career-guidance/FormContainer";
import { NavigationButtons } from "@/components/career-guidance/NavigationButtons";
import { ClarificationQuestionItem } from "@/components/career-guidance/ClarificationQuestionItem";
import { ProgressIndicator } from "@/components/career-guidance/ProgressIndicator";
import { storage } from "@/utils/storage";
import { ClarifyingQuestion } from "@/types/career";

const questions: ClarifyingQuestion[] = [
  {
    id: "skills-strengths",
    text: "What are your skills and strengths? Consider what tasks energize you, what skills others compliment you on, and what problems you enjoy solving."
  },
  {
    id: "work-environment",
    text: "What kind of work environment or lifestyle do you want? Think about whether you prefer working alone or in teams, structured routines or flexibility, and your ideal work-life balance."
  },
  {
    id: "fields-industries",
    text: "What fields or industries excite you? Consider which topics naturally interest you, what problems or trends excite you, and whether you prefer high-demand industries or passion-driven niches."
  },
  {
    id: "career-exploration",
    text: "How will you test and explore your career path? Think about potential side projects, networking opportunities, or small steps you can take in the next month to explore your chosen direction."
  }
];

const CareerClarification = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const savedInfo = storage.getCareerInfo();
    if (savedInfo.clarificationAnswers) {
      setAnswers(savedInfo.clarificationAnswers);
    }
  }, []);

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!answers[currentQuestion.id]?.trim()) {
      toast.error("Please answer the current question before proceeding");
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error("Please answer all questions");
      return;
    }

    storage.saveCareerInfo({ clarificationAnswers: answers });
    navigate("/career-goal-suggestion");
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <ProgressIndicator />
      <FormContainer title="More About You">
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg space-y-3">
            <p className="text-gray-700">
              These open-ended questions are designed to help you explore your skills, preferences, and aspirations in more detail. 
              Take your time to reflect on each question.
            </p>
            <div className="text-sm font-medium text-blue-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>

          <div key={currentQuestion.id}>
            <ClarificationQuestionItem
              question={currentQuestion}
              value={answers[currentQuestion.id] || ""}
              onChange={(value) => 
                setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
              }
            />
          </div>

          <NavigationButtons
            onBack={handleBack}
            onNext={handleNext}
            nextButtonText={currentQuestionIndex === questions.length - 1 ? "Generate Career Goal" : "Next"}
          />
        </div>
      </FormContainer>
    </>
  );
};

export default CareerClarification;
