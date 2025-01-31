import { useState, useEffect } from "react";
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
import { Pencil, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    const generateSteps = async () => {
      try {
        const careerInfo = JSON.parse(localStorage.getItem("careerInfo") || "{}");
        const careerGoals = localStorage.getItem("careerGoals") || "";
        const skills = JSON.parse(localStorage.getItem("skills") || "[]");

        // This is a mock AI response - in a real app, you'd call an AI API here
        const mockSteps = [
          {
            content: `Research advanced certifications in ${careerInfo.industry}`,
            timeframe: "1-3 months",
            explanation: "Professional certifications demonstrate your commitment to growth and validate your expertise to potential employers. They can significantly increase your marketability and open doors to advanced positions.",
            isOriginal: true
          },
          {
            content: `Build a portfolio showcasing your ${skills[0]} skills`,
            timeframe: "2-4 months",
            explanation: "A well-curated portfolio provides tangible evidence of your capabilities and helps you stand out in competitive job markets. It's your personal brand showcase that speaks louder than any resume.",
            isOriginal: true
          },
          {
            content: `Network with professionals in ${careerInfo.occupation} roles`,
            timeframe: "1-2 months",
            explanation: "Professional networking is crucial for career advancement. It provides insider industry knowledge, mentorship opportunities, and often leads to job opportunities before they're publicly posted.",
            isOriginal: true
          },
          {
            content: "Attend industry conferences and workshops",
            timeframe: "3-6 months",
            explanation: "Industry events keep you updated with the latest trends and technologies while providing valuable face-to-face networking opportunities. They're essential for staying relevant in your field.",
            isOriginal: true
          },
          {
            content: "Seek mentorship opportunities",
            timeframe: "1-3 months",
            explanation: "Mentors can provide invaluable guidance, share their experiences, and help you avoid common career pitfalls. Their insights can accelerate your professional growth significantly.",
            isOriginal: true
          },
          {
            content: "Create a detailed timeline for career progression",
            timeframe: "1-2 months",
            explanation: "A structured timeline helps you stay focused and accountable to your goals. It transforms abstract aspirations into concrete, actionable milestones.",
            isOriginal: true
          }
        ].map((step, id) => ({
          id,
          ...step,
          isEditing: false
        }));

        setSteps(mockSteps);
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

    generateSteps();
  }, [toast]);

  const handleEdit = (step: Step) => {
    setSteps(steps.map(s => ({
      ...s,
      isEditing: s.id === step.id ? true : false
    })));
    setEditingContent(step.content);
    setEditingTimeframe(step.timeframe);
  };

  const handleSave = (step: Step) => {
    if (!editingContent.trim()) {
      toast({
        title: "Error",
        description: "Step content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (!editingTimeframe.trim()) {
      toast({
        title: "Error",
        description: "Timeframe cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setSteps(steps.map(s => 
      s.id === step.id 
        ? { 
            ...s, 
            content: editingContent.trim(), 
            timeframe: editingTimeframe.trim(),
            isEditing: false,
            isOriginal: false // Remove original status when edited
          }
        : s
    ));
    setEditingContent("");
    setEditingTimeframe("");
  };

  const handleCancel = (step: Step) => {
    setSteps(steps.map(s => 
      s.id === step.id 
        ? { ...s, isEditing: false }
        : s
    ));
    setEditingContent("");
    setEditingTimeframe("");
  };

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
              Based on your career goals and skills, here are the recommended next steps with estimated timeframes.
              You can edit these steps and timeframes to make them more personalized.
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
                  {steps.map((step) => (
                    <div
                      key={step.id}
                      className="flex flex-col p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                    >
                      {step.isEditing ? (
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Input
                              value={editingContent}
                              onChange={(e) => setEditingContent(e.target.value)}
                              className="flex-1"
                              placeholder="Enter step description"
                            />
                            <Input
                              value={editingTimeframe}
                              onChange={(e) => setEditingTimeframe(e.target.value)}
                              className="w-32"
                              placeholder="e.g. 1-3 months"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleSave(step)}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleCancel(step)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <span className="text-gray-700">{step.content}</span>
                              <span className="ml-2 text-sm text-gray-500">
                                ({step.timeframe})
                              </span>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(step)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </div>
                          {step.isOriginal && step.explanation && (
                            <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded">
                              {step.explanation}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleReset}
                    className="w-full"
                    variant="outline"
                  >
                    Start Over
                  </Button>
                  <Button
                    onClick={handleCommit}
                    className="w-full"
                  >
                    Commit to These Steps
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NextSteps;