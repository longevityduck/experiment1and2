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
            timeframe: "1-3 months"
          },
          {
            content: `Build a portfolio showcasing your ${skills[0]} skills`,
            timeframe: "2-4 months"
          },
          {
            content: `Network with professionals in ${careerInfo.occupation} roles`,
            timeframe: "1-2 months"
          },
          {
            content: "Attend industry conferences and workshops",
            timeframe: "3-6 months"
          },
          {
            content: "Seek mentorship opportunities",
            timeframe: "1-3 months"
          },
          {
            content: "Create a detailed timeline for career progression",
            timeframe: "1-2 months"
          }
        ].map((step, id) => ({
          id,
          content: step.content,
          timeframe: step.timeframe,
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
            isEditing: false 
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
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
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
                        </>
                      )}
                    </div>
                  ))}
                </div>

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

export default NextSteps;