import { useState, useEffect } from "react";
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

  useEffect(() => {
    // Load previously saved answers
    const savedInfo = storage.getCareerInfo();
    if (savedInfo.clarificationAnswers) {
      setAnswers(savedInfo.clarificationAnswers);
    }
  }, []);

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
    <FormContainer title="More About You">
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
          nextButtonText="Generate Career Goal"
        />
      </form>
    </FormContainer>
  );
};

export default CareerClarification;