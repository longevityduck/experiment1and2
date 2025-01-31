import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import StepsList from "@/components/next-steps/StepsList";
import ActionButtons from "@/components/next-steps/ActionButtons";

interface Step {
  id: number;
  content: string;
  timeframe: string;
  isEditing: boolean;
  explanation?: string;
  isOriginal?: boolean;
}

const NextSteps = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<Step[]>([]);
  const [editingContent, setEditingContent] = useState("");
  const [editingTimeframe, setEditingTimeframe] = useState("");

  useEffect(() => {
    const loadSteps = async () => {
      try {
        // First try to load saved steps
        const savedSteps = localStorage.getItem("userSteps");
        if (savedSteps) {
          setSteps(JSON.parse(savedSteps));
          setLoading(false);
          return;
        }

        // If no saved steps, generate new ones
        const careerInfo = JSON.parse(localStorage.getItem("careerInfo") || "{}");
        const skills = JSON.parse(localStorage.getItem("skills") || "[]");

        const mockSteps = [
          {
            content: `Research advanced certifications in ${careerInfo.industry}`,
            timeframe: "1-3 months",
            explanation:
              "Professional certifications demonstrate your commitment to growth and validate your expertise to potential employers. They can significantly increase your marketability and open doors to advanced positions.",
            isOriginal: true,
          },
          {
            content: `Build a portfolio showcasing your ${skills[0]} skills`,
            timeframe: "2-4 months",
            explanation:
              "A well-curated portfolio provides tangible evidence of your capabilities and helps you stand out in competitive job markets. It's your personal brand showcase that speaks louder than any resume.",
            isOriginal: true,
          },
          {
            content: `Network with professionals in ${careerInfo.occupation} roles`,
            timeframe: "1-2 months",
            explanation:
              "Professional networking is crucial for career advancement. It provides insider industry knowledge, mentorship opportunities, and often leads to job opportunities before they're publicly posted.",
            isOriginal: true,
          },
          {
            content: "Attend industry conferences and workshops",
            timeframe: "3-6 months",
            explanation:
              "Industry events keep you updated with the latest trends and technologies while providing valuable face-to-face networking opportunities. They're essential for staying relevant in your field.",
            isOriginal: true,
          },
          {
            content: "Seek mentorship opportunities",
            timeframe: "1-3 months",
            explanation:
              "Mentors can provide invaluable guidance, share their experiences, and help you avoid common career pitfalls. Their insights can accelerate your professional growth significantly.",
            isOriginal: true,
          },
          {
            content: "Create a detailed timeline for career progression",
            timeframe: "1-2 months",
            explanation:
              "A structured timeline helps you stay focused and accountable to your goals. It transforms abstract aspirations into concrete, actionable milestones.",
            isOriginal: true,
          },
        ].map((step, id) => ({
          id,
          ...step,
          isEditing: false,
        }));

        setSteps(mockSteps);
        // Save the initial steps
        localStorage.setItem("userSteps", JSON.stringify(mockSteps));
        setLoading(false);
      } catch (error) {
        console.error("Error generating steps:", error);
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to generate next steps. Please try again.",
          variant: "destructive",
        });
      }
    };

    loadSteps();
  }, [toast]);

  // Save steps whenever they change
  useEffect(() => {
    if (!loading && steps.length > 0) {
      localStorage.setItem("userSteps", JSON.stringify(steps));
    }
  }, [steps, loading]);

  const handleReset = () => {
    localStorage.removeItem("careerInfo");
    localStorage.removeItem("careerGoals");
    localStorage.removeItem("skills");
    navigate("/");
  };

  const handleCommit = () => {
    navigate("/phone-commitment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded">
            <div className="h-2 bg-blue-600 rounded w-full"></div>
          </div>
          <div className="mt-2 text-sm text-gray-500 text-center">Final Step</div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Next Steps</CardTitle>
            <CardDescription>
              Based on your career goals and skills, here are the recommended next
              steps with estimated timeframes. You can edit these steps and
              timeframes to make them more personalized.
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
                <StepsList
                  steps={steps}
                  setSteps={setSteps}
                  editingContent={editingContent}
                  editingTimeframe={editingTimeframe}
                  setEditingContent={setEditingContent}
                  setEditingTimeframe={setEditingTimeframe}
                />
                <ActionButtons onReset={handleReset} onCommit={handleCommit} />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NextSteps;
