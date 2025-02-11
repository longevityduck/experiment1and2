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
    text: "What are you really good at? Think about things you enjoy doing, what your friends say you're good at, and problems you like to solve."
  },
  {
    id: "work-environment",
    text: "How do you like to work? For example: Do you prefer working with others or by yourself? Do you like following a schedule or being flexible? How much free time do you want to have?"
  },
  {
    id: "fields-industries",
    text: "What subjects or activities get you excited? Tell us about topics you love learning about or things happening in the world that interest you the most."
  },
  {
    id: "career-exploration",
    text: "What small steps could you take in the next month to learn more about jobs you might like? Maybe join a club, talk to someone with an interesting job, or try a new hobby?"
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
