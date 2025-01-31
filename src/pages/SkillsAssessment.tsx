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

interface CareerInfo {
  age: string;
  industry: string;
  occupation: string;
  experience: string;
}

const SkillsAssessment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => {
    const generateSkills = async () => {
      try {
        const careerInfo = JSON.parse(localStorage.getItem("careerInfo") || "{}") as CareerInfo;
        const careerGoals = localStorage.getItem("careerGoals") || "";

        // This is a mock AI response - in a real app, you'd call an AI API here
        const mockSkills = [
          `${careerInfo.industry} Industry Knowledge`,
          `${careerInfo.occupation} Expertise`,
          "Project Management",
          "Communication",
          "Leadership",
          `${careerInfo.industry} Tools and Technologies`,
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

  const handleReset = () => {
    localStorage.removeItem("careerInfo");
    localStorage.removeItem("careerGoals");
    navigate("/");
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
              Based on your experience and industry, here are your likely key skills:
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
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="p-3 bg-blue-50 rounded-lg text-blue-800 font-medium"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            )}

            <Button
              onClick={handleReset}
              className="w-full mt-6"
            >
              Start Over
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkillsAssessment;