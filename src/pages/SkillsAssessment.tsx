import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SkillInput } from "@/components/skills/SkillInput";
import { SkillsList } from "@/components/skills/SkillsList";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FormContainer } from "@/components/career-guidance/FormContainer";
import { ProgressIndicator } from "@/components/career-guidance/ProgressIndicator";
import { supabase } from "@/integrations/supabase/client";

const SkillsAssessment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<string[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const generateSkills = async () => {
      try {
        const savedSkills = localStorage.getItem("userSkills");
        if (savedSkills) {
          setSkills(JSON.parse(savedSkills));
          setLoading(false);
          return;
        }

        const careerInfo = JSON.parse(localStorage.getItem("careerInfo") || "{}");
        
        if (!careerInfo.industry || !careerInfo.occupation || !careerInfo.experience) {
          toast.error("Missing required information. Please complete your profile first.");
          navigate("/personal-info");
          return;
        }

        const { data, error } = await supabase.functions.invoke('generate-skills', {
          body: {
            industry: careerInfo.industry,
            occupation: careerInfo.occupation,
            experience: careerInfo.experience
          }
        });

        if (error) {
          console.error('Error generating skills:', error);
          throw new Error('Failed to generate skills');
        }

        const generatedSkills = data.skills;
        setSkills(generatedSkills);
        localStorage.setItem("userSkills", JSON.stringify(generatedSkills));
        localStorage.setItem("skills", JSON.stringify(generatedSkills));
      } catch (error) {
        console.error("Error generating skills:", error);
        toast.error("Failed to generate skills. Using default skills instead.");
        
        const careerInfo = JSON.parse(localStorage.getItem("careerInfo") || "{}");
        const defaultSkills = [
          `${careerInfo.industry || 'Industry'} Knowledge`,
          `${careerInfo.occupation || 'Professional'} Expertise`,
          "Project Management",
          "Communication",
          "Leadership",
        ];
        
        setSkills(defaultSkills);
        localStorage.setItem("userSkills", JSON.stringify(defaultSkills));
        localStorage.setItem("skills", JSON.stringify(defaultSkills));
      } finally {
        setLoading(false);
      }
    };

    generateSkills();
  }, [navigate]);

  const handleConfirm = () => {
    setIsConfirmed(true);
    navigate("/next-steps");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <ProgressIndicator />
        <FormContainer title="Your Skills Assessment">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-sm text-gray-600 space-y-2">
                <p>Based on your profile information, we've generated a list of relevant skills for your career path.</p>
                <p>Please review and customize this list to accurately reflect your current skillset. Understanding your skills helps us better guide your next career steps.</p>
              </div>

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
                Let's see Your Career Plan!
              </Button>
            </div>
          )}
        </FormContainer>
      </div>
    </div>
  );
};

export default SkillsAssessment;