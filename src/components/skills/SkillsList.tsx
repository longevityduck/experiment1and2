import { X } from "lucide-react";

interface SkillsListProps {
  skills: string[];
  isConfirmed: boolean;
  onDeleteSkill?: (index: number) => void;
}

export const SkillsList = ({ skills, isConfirmed, onDeleteSkill }: SkillsListProps) => {
  return (
    <div className="space-y-4 mb-6">
      {skills.map((skill, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg text-blue-800 font-medium"
        >
          {skill}
          {!isConfirmed && onDeleteSkill && (
            <button
              onClick={() => onDeleteSkill(index)}
              className="text-blue-600 hover:text-blue-800"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};