
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { QuestionItem } from "@/components/career-guidance/QuestionItem";
import { FormContainer } from "@/components/career-guidance/FormContainer";
import { NavigationButtons } from "@/components/career-guidance/NavigationButtons";
import { ProgressIndicator } from "@/components/career-guidance/ProgressIndicator";
import { storage } from "@/utils/storage";
import { GuidanceQuestion } from "@/types/career";

const questions: GuidanceQuestion[] = [
  {
    id: 1,
    text: "How do you feel about what you're doing right now in school or work?",
    options: [
      "I really love it!",
      "It's pretty good",
      "It's okay",
      "I don't like it much",
      "I really don't like it"
    ]
  },
  {
    id: 2,
    text: "What makes you want to try something new?",
    options: [
      "I want to earn more money",
      "I want more free time",
      "I want to do something that helps others",
      "I want to learn new things",
      "I want to grow as a person"
    ]
  },
  {
    id: 3,
    text: "What would you like to be doing 5 years from now?",
    options: [
      "Doing the same thing but being better at it",
      "Doing something different but in the same field",
      "Trying out a completely new field",
      "Starting my own thing",
      "Working less and enjoying life more",
      "Not sure yet, but want to explore"
    ]
  },
  {
    id: 4,
    text: "How do you feel about trying new things?",
    options: [
      "I love trying new things!",
      "I'll try if it seems interesting",
      "I prefer to play it safe",
      "I don't like big changes",
      "I'm not sure"
    ]
  },
  {
    id: 5,
    text: "What matters most to you when thinking about your future?",
    options: [
      "Having enough money to feel safe",
      "Having time for family and fun",
      "Learning and getting better at things",
      "Being my own boss",
      "Making the world better"
    ]
  }
];

const CareerGuidance = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const savedInfo = storage.getCareerInfo();
    if (savedInfo.guidanceAnswers) {
      setAnswers(savedInfo.guidanceAnswers);
      // Find the first unanswered question
      const firstUnanswered = questions.findIndex(
        (q) => !savedInfo.guidanceAnswers[q.id]
      );
      setCurrentQuestionIndex(firstUnanswered === -1 ? questions.length - 1 : firstUnanswered);
    }
  }, []);

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!answers[currentQuestion.id]) {
      toast.error("Please choose an answer before moving on");
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

    storage.saveCareerInfo({ guidanceAnswers: answers });

    // Check user's 5-year plan (question with id 3)
    const fiveYearPlan = answers[3];
    
    if (fiveYearPlan === "Starting my own thing") {
      navigate("/entrepreneurship-resources");
    } else if (fiveYearPlan === "Doing something different but in the same field" || 
               fiveYearPlan === "Trying out a completely new field") {
      navigate("/what-role");
    } else {
      navigate("/career-clarification");
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <ProgressIndicator />
      <FormContainer title="Tell Us About Yourself">
        <div className="space-y-8">
          <div className="bg-blue-50 p-4 rounded-lg space-y-3">
            <p className="text-gray-700">
              Let's get to know you better! We'll ask you a few simple questions about what you like 
              and what you want for your future. Take your time - there are no wrong answers!
            </p>
            <div className="text-sm font-medium text-blue-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>

          <div key={currentQuestion.id}>
            <QuestionItem
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
            nextButtonText={currentQuestionIndex === questions.length - 1 ? "Continue" : "Next Question"}
          />
        </div>
      </FormContainer>
    </>
  );
};

export default CareerGuidance;
