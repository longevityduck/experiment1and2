
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
    text: "How do you feel about your current career?",
    options: [
      "I love it!",
      "It's okay",
      "Not sure how I feel",
      "Not really happy with it",
      "I really don't like it"
    ]
  },
  {
    id: 2,
    text: "What's the main reason you're thinking about changing your path?",
    options: [
      "I want to earn more money",
      "I want more free time",
      "I want to do something meaningful",
      "I want new challenges",
      "I want to grow as a person"
    ]
  },
  {
    id: 3,
    text: "Where do you picture yourself in 5 years?",
    options: [
      "Same job but higher position",
      "Same field but different job",
      "Same job but different field",
      "Completely different job and field",
      "Starting my own business",
      "Working part-time or less"
    ]
  },
  {
    id: 4,
    text: "How comfortable are you with taking chances in your career?",
    options: [
      "Very comfortable - I'll take big chances",
      "Somewhat comfortable with some risks",
      "Prefer to play it safe",
      "Want to avoid risks completely",
      "Not sure about taking risks"
    ]
  },
  {
    id: 5,
    text: "What matters most to you in your future career?",
    options: [
      "Having a stable income",
      "Having time for myself and family",
      "Learning and getting better",
      "Having more independence to work on what I want",
      "Making a difference in people's lives"
    ]
  }
];

const CareerGuidance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const savedInfo = storage.getCareerInfo();
    
    // Check if we're coming from career goals with "not sure" option
    const comingFromCareerGoals = savedInfo.careerGoals === "" && 
                                 location.state?.from === "careerGoals";
    
    // If coming from career goals with "not sure", always start at the first question
    if (comingFromCareerGoals) {
      setCurrentQuestionIndex(0);
      // Initialize with empty answers
      setAnswers({});
      // Save empty guidance answers to storage to avoid future conflicts
      storage.saveCareerInfo({ guidanceAnswers: {} });
      return;
    }
    
    // Regular flow - Initialize answers if they exist
    if (savedInfo.guidanceAnswers) {
      setAnswers(savedInfo.guidanceAnswers);
      
      // Find the first unanswered question
      const firstUnanswered = questions.findIndex(
        (q) => !savedInfo.guidanceAnswers[q.id]
      );
      
      // Handle the index appropriately
      if (Object.keys(savedInfo.guidanceAnswers).length === 0) {
        setCurrentQuestionIndex(0);
      } else {
        setCurrentQuestionIndex(firstUnanswered === -1 ? questions.length - 1 : firstUnanswered);
      }
    }
  }, [location]);

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!answers[currentQuestion.id]) {
      toast.error("Please select an answer before moving forward");
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
    
    if (fiveYearPlan === "Starting my own business") {
      navigate("/entrepreneurship-resources");
    } else if (
      fiveYearPlan === "Completely different job and field" || 
      fiveYearPlan === "Same field but different job"
    ) {
      // Only show the role selection screen for these specific choices
      navigate("/what-role");
    } else {
      // Skip role selection for other choices
      navigate("/career-goal-suggestion");
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <ProgressIndicator />
      <FormContainer title="About You">
        <div className="space-y-8">
          <div className="bg-blue-50 p-4 rounded-lg space-y-3">
            <p className="text-gray-700">
              Let's get to know you better! We'll ask you a few simple questions about your career thoughts.
            </p>
            <p className="text-gray-700">
              Take your time with each question - there are no right or wrong answers. Just pick what feels true for you.
            </p>
          </div>

          <div className="space-y-8">
            <div className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            
            <QuestionItem
              key={currentQuestion.id}
              question={currentQuestion}
              value={answers[currentQuestion.id] || ""}
              onChange={(value) => 
                setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
              }
            />

            <NavigationButtons
              onBack={handleBack}
              onNext={handleNext}
              nextButtonText={currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
            />
          </div>
        </div>
      </FormContainer>
    </>
  );
};

export default CareerGuidance;
