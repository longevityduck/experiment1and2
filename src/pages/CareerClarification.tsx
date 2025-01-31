import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FormContainer } from "@/components/career-guidance/FormContainer";
import { NavigationButtons } from "@/components/career-guidance/NavigationButtons";
import { ClarificationQuestionItem } from "@/components/career-guidance/ClarificationQuestionItem";
import { storage } from "@/utils/storage";
import { ClarifyingQuestion } from "@/types/career";

const questions: ClarifyingQuestion[] = [
  {
    id: "skills-strengths",
    text: "What are your top skills and strengths? Include both technical and soft skills."
  },
  {
    id: "interests",
    text: "What topics, activities, or types of work do you find most engaging and enjoyable?"
  },
  {
    id: "values",
    text: "What are your core values in relation to work? (e.g., creativity, stability, independence)"
  },
  {
    id: "constraints",
    text: "Are there any constraints or requirements for your next career move? (e.g., location, salary, work-life balance)"
  },
  {
    id: "ideal-environment",
    text: "Describe your ideal work environment and culture."
  }
];

const CareerClarification = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(answers).length < questions.length) {
      toast.error("Please answer all questions");
      return;
    }

    storage.saveCareerInfo({ clarificationAnswers: answers });
    navigate("/career-goal-suggestion");
  };

  return (
    <FormContainer title="Career Clarification">
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((question) => (
          <ClarificationQuestionItem
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
          nextButtonText="Get AI Career Suggestion"
        />
      </form>
    </FormContainer>
  );
};

export default CareerClarification;
