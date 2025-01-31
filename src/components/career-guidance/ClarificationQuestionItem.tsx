import { ClarifyingQuestion } from "@/types/career";
import { Textarea } from "@/components/ui/textarea";

interface ClarificationQuestionItemProps {
  question: ClarifyingQuestion;
  value: string;
  onChange: (value: string) => void;
}

export const ClarificationQuestionItem = ({ 
  question, 
  value, 
  onChange 
}: ClarificationQuestionItemProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {question.text} <span className="text-red-500">*</span>
      </label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your answer..."
        className="min-h-[100px]"
        required
      />
    </div>
  );
};