import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SkillInput } from "@/components/skills/SkillInput";
import { SkillsList } from "@/components/skills/SkillsList";
import { Loader2, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { FormContainer } from "@/components/career-guidance/FormContainer";
import { ProgressIndicator } from "@/components/career-guidance/ProgressIndicator";

const SkillsAssessment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<string[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const loadOrGenerateSkills = async () => {
      try {
        const savedSkills = localStorage.getItem("userSkills");
        if (savedSkills) {
          setSkills(JSON.parse(savedSkills));
          setLoading(false);
          return;
        }

        const careerInfo = JSON.parse(localStorage.getItem("careerInfo") || "{}");
        const mockSkills = [
          `${careerInfo.industry || 'Industry'} Knowledge`,
          `${careerInfo.occupation || 'Professional'} Expertise`,
          "Project Management",
          "Communication",
          "Leadership",
        ];

        setSkills(mockSkills);
        localStorage.setItem("userSkills", JSON.stringify(mockSkills));
        localStorage.setItem("skills", JSON.stringify(mockSkills));
        setLoading(false);
      } catch (error) {
        console.error("Error loading/generating skills:", error);
        setLoading(false);
        toast.error("Failed to load skills. Please try again.");
      }
    };

    loadOrGenerateSkills();
  }, []);

  useEffect(() => {
    if (!loading && skills.length > 0) {
      localStorage.setItem("userSkills", JSON.stringify(skills));
      localStorage.setItem("skills", JSON.stringify(skills));
    }
  }, [skills, loading]);

  const handleConfirm = () => {
    setIsConfirmed(true);
    navigate("/next-steps");
  };

  return (
    <FormContainer title="Your Skills Assessment">
      <ProgressIndicator />
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="animate-fade-in">
            <SkillsList 
              skills={skills} 
              isConfirmed={isConfirmed} 
              onDeleteSkill={(index) => {
                setSkills(skills.filter((_, i) => i !== index));
                toast.success("Skill removed successfully");
              }}
            />

            {!isConfirmed && (
              <SkillInput 
                onAddSkill={(skill) => {
                  setSkills([...skills, skill]);
                  toast.success("Skill added successfully");
                }}
                existingSkills={skills}
              />
            )}
          </div>

          <Button
            onClick={handleConfirm}
            className="w-full"
            disabled={skills.length === 0}
          >
            Continue to Next Steps
          </Button>
        </div>
      )}
    </FormContainer>
  );
};

export default SkillsAssessment;