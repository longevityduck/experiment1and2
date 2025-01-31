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
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CareerInfo {
  age: string;
  industry: string;
  customIndustry?: string;
  occupation: string;
  experience: string;
}

const SkillsAssessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const generateSkills = async () => {
      try {
        const careerInfo = JSON.parse(localStorage.getItem("careerInfo") || "{}") as CareerInfo;
        const careerGoals = localStorage.getItem("careerGoals") || "";

        // This is a mock AI response - in a real app, you'd call an AI API here
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
        setLoading(false);
      } catch (error) {
        console.error("Error generating skills:", error);
        setLoading(false);
      }
    };

    generateSkills();
  }, []);

  const handleDeleteSkill = (indexToDelete: number) => {
    setSkills(skills.filter((_, index) => index !== indexToDelete));
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) {
      toast({
        title: "Error",
        description: "Please enter a skill",
        variant: "destructive",
      });
      return;
    }

    if (skills.length >= 14) {
      toast({
        title: "Error",
        description: "Maximum 14 skills allowed",
        variant: "destructive",
      });
      return;
    }

    if (skills.includes(newSkill.trim())) {
      toast({
        title: "Error",
        description: "This skill already exists",
        variant: "destructive",
      });
      return;
    }

    setSkills([...skills, newSkill.trim()]);
    setNewSkill("");
  };

  const handleReset = () => {
    localStorage.removeItem("careerInfo");
    localStorage.removeItem("careerGoals");
    navigate("/");
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    toast({
      title: "Success",
      description: "Skills confirmed successfully!",
    });
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
                <div className="space-y-4 mb-6">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg text-blue-800 font-medium"
                    >
                      {skill}
                      {!isConfirmed && (
                        <button
                          onClick={() => handleDeleteSkill(index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {!isConfirmed && (
                  <div className="space-y-4">
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
                    
                    <Button
                      onClick={handleConfirm}
                      className="w-full bg-green-600 hover:bg-green-700"
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