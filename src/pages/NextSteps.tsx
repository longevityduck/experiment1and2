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
  isEditing: boolean;
}

const NextSteps = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<Step[]>([]);
  const [editingContent, setEditingContent] = useState("");

  useEffect(() => {
    const generateSteps = async () => {
      try {
        const careerInfo = JSON.parse(localStorage.getItem("careerInfo") || "{}");
        const careerGoals = localStorage.getItem("careerGoals") || "";
        const skills = JSON.parse(localStorage.getItem("skills") || "[]");

        // This is a mock AI response - in a real app, you'd call an AI API here
        const mockSteps = [
          `Research advanced certifications in ${careerInfo.industry}`,
          `Build a portfolio showcasing your ${skills[0]} skills`,
          `Network with professionals in ${careerInfo.occupation} roles`,
          "Attend industry conferences and workshops",
          "Seek mentorship opportunities",
          "Create a detailed timeline for career progression"
        ].map((content, id) => ({
          id,
          content,
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

    setSteps(steps.map(s => 
      s.id === step.id 
        ? { ...s, content: editingContent.trim(), isEditing: false }
        : s
    ));
    setEditingContent("");
  };

  const handleCancel = (step: Step) => {
    setSteps(steps.map(s => 
      s.id === step.id 
        ? { ...s, isEditing: false }
        : s
    ));
    setEditingContent("");
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
              Based on your career goals and skills, here are the recommended next steps.
              You can edit these steps to make them more personalized.
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
                        <div className="flex-1 flex items-center gap-2">
                          <Input
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            className="flex-1"
                            placeholder="Enter step description"
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
                      ) : (
                        <>
                          <span className="flex-1 text-gray-700">{step.content}</span>
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