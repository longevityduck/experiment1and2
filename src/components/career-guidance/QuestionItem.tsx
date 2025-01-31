import { GuidanceQuestion } from "@/types/career";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuestionItemProps {
  question: GuidanceQuestion;
  value: string;
  onChange: (value: string) => void;
}

export const QuestionItem = ({ question, value, onChange }: QuestionItemProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">{question.text}</h2>
      <RadioGroup
        value={value}
        onValueChange={onChange}
      >
        <div className="space-y-2">
          {question.options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`${question.id}-${option}`} />
              <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};