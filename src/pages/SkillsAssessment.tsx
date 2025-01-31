import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SkillInput } from "@/components/skills/SkillInput";
import { SkillsList } from "@/components/skills/SkillsList";

interface CareerInfo {
  age: string;
  industry: string;
  customIndustry?: string;
  occupation: string;
  experience: string;
}

const SkillsAssessment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<string[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const loadOrGenerateSkills = async () => {
      try {
        // First try to load saved skills
        const savedSkills = localStorage.getItem("userSkills");
        if (savedSkills) {
          setSkills(JSON.parse(savedSkills));
          setLoading(false);
          return;
        }

        // If no saved skills, generate default ones based on career info
        const careerInfo = JSON.parse(localStorage.getItem("careerInfo") || "{}") as CareerInfo;
        const industryDisplay = careerInfo.customIndustry || careerInfo.industry;
        const mockSkills = [
          `${industryDisplay} Industry Knowledge`,
          `${careerInfo.occupation} Expertise`,
          "Project Management",
          "Communication",
          "Leadership",
          `${industryDisplay} Tools and Technologies`,
        ];

        setSkills(mockSkills);
        // Save the initial skills
        localStorage.setItem("userSkills", JSON.stringify(mockSkills));
        setLoading(false);
      } catch (error) {
        console.error("Error loading/generating skills:", error);
        setLoading(false);
      }
    };

    loadOrGenerateSkills();
  }, []);

  // Save skills whenever they change
  useEffect(() => {
    if (!loading && skills.length > 0) {
      localStorage.setItem("userSkills", JSON.stringify(skills));
      // Also save to skills key for backward compatibility
      localStorage.setItem("skills", JSON.stringify(skills));
    }
  }, [skills, loading]);

  const handleDeleteSkill = (indexToDelete: number) => {
    setSkills(skills.filter((_, index) => index !== indexToDelete));
  };

  const handleAddSkill = (newSkill: string) => {
    setSkills([...skills, newSkill]);
  };

  const handleReset = () => {
    localStorage.removeItem("careerInfo");
    localStorage.removeItem("careerGoals");
    localStorage.removeItem("skills");
    localStorage.removeItem("userSkills");
    localStorage.removeItem("personalInfo");
    navigate("/");
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    navigate("/next-steps");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded">
            <div className="h-2 bg-blue-600 rounded w-full"></div>
          </div>
          <div className="mt-2 text-sm text-gray-500 text-center">Step 3 of 3</div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Skills Assessment</CardTitle>
            <CardDescription>
              {isConfirmed 
                ? "Here are your confirmed skills:"
                : "Based on your experience and industry, here are your likely key skills. Please review and customize them:"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : (
              <>
                <SkillsList 
                  skills={skills} 
                  isConfirmed={isConfirmed} 
                  onDeleteSkill={handleDeleteSkill}
                />

                {!isConfirmed && (
                  <div className="space-y-4">
                    <SkillInput 
                      onAddSkill={handleAddSkill}
                      existingSkills={skills}
                    />
                    
                    <Button
                      onClick={handleConfirm}
                      className="w-full"
                    >
                      Confirm Skills
                    </Button>
                  </div>
                )}

                <Button
                  onClick={handleReset}
                  className="w-full mt-6"
                  variant="outline"
                >
                  Start Over
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkillsAssessment;