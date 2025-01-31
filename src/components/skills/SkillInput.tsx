import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface SkillInputProps {
  onAddSkill: (skill: string) => void;
  existingSkills: string[];
}

export const SkillInput = ({ onAddSkill, existingSkills }: SkillInputProps) => {
  const [newSkill, setNewSkill] = useState("");
  const { toast } = useToast();

  const handleAddSkill = () => {
    if (!newSkill.trim()) {
      toast({
        title: "Error",
        description: "Please enter a skill",
        variant: "destructive",
      });
      return;
    }

    if (existingSkills.length >= 14) {
      toast({
        title: "Error",
        description: "Maximum 14 skills allowed",
        variant: "destructive",
      });
      return;
    }

    if (existingSkills.includes(newSkill.trim())) {
      toast({
        title: "Error",
        description: "This skill already exists",
        variant: "destructive",
      });
      return;
    }

    onAddSkill(newSkill.trim());
    setNewSkill("");
  };

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        placeholder="Add a new skill"
        value={newSkill}
        onChange={(e) => setNewSkill(e.target.value)}
        maxLength={50}
      />
      <Button onClick={handleAddSkill} className="whitespace-nowrap">
        Add Skill
      </Button>
    </div>
  );
};