import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { QuestionItem } from "@/components/career-guidance/QuestionItem";
import { FormContainer } from "@/components/career-guidance/FormContainer";
import { NavigationButtons } from "@/components/career-guidance/NavigationButtons";
import { storage } from "@/utils/storage";
import { GuidanceQuestion } from "@/types/career";

const questions: GuidanceQuestion[] = [
  {
    id: 1,
    text: "How satisfied are you with your current career path?",
    options: ["Very satisfied", "Somewhat satisfied", "Neutral", "Somewhat dissatisfied", "Very dissatisfied"]
  },
  {
    id: 2,
    text: "What's your primary motivation for considering career changes?",
    options: ["Higher income", "Better work-life balance", "More meaningful work", "New challenges", "Personal growth"]
  },
  {
    id: 3,
    text: "Where do you see yourself in the next 5 years?",
    options: ["Same role, more senior", "Different role, same industry", "Different industry", "Own business", "Semi-retired"]
  },
  {
    id: 4,
    text: "How much risk are you willing to take in your career?",
    options: ["Very high risk", "Moderate risk", "Low risk", "No risk", "Unsure"]
  },
  {
    id: 5,
    text: "What's most important to you in your career?",
    options: ["Financial security", "Work-life balance", "Professional growth", "Independence", "Impact on others"]
  }
];

const CareerGuidance = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(answers).length < questions.length) {
      toast.error("Please answer all questions");
      return;
    }

    storage.saveCareerInfo({ guidanceAnswers: answers });
    navigate("/career-clarification");
  };

  return (
    <FormContainer title="About You">
      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            value={answers[question.id] || ""}
            onChange={(value) => 
              setAnswers((prev) => ({ ...prev, [question.id]: value }))
            }
          />
        ))}

        <NavigationButtons
          onBack={() => navigate(-1)}
          onNext={() => {}}
        />
      </form>
    </FormContainer>
  );
};

export default CareerGuidance;
