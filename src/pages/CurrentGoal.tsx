import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const CurrentGoal = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [goal, setGoal] = useState("Become a Senior Software Engineer within 2 years");

  const handleSave = () => {
    if (!goal.trim()) {
      toast.error("Please enter a goal before saving");
      return;
    }
    
    try {
      // Save to localStorage for now (this would typically go to a backend)
      localStorage.setItem("currentGoal", goal);
      toast.success("Goal updated successfully!");
      navigate("/next-steps");
    } catch (error) {
      toast.error("Failed to save goal. Please try again.");
      console.error("Error saving goal:", error);
    }
  };

  const handleContinue = () => {
    // Save current goal to localStorage before navigating
    localStorage.setItem("currentGoal", goal);
    navigate("/next-steps");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto pt-12">
        <Card>
          <CardHeader>
            <CardTitle>Your Current Career Goal</CardTitle>
            <CardDescription>
              Review and update your career goal if needed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <Textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="min-h-[100px]"
                  placeholder="Enter your career goal..."
                />
                <div className="flex gap-4">
                  <Button onClick={handleSave} className="flex-1">
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-lg p-4 bg-muted rounded-md">{goal}</p>
                <div className="flex gap-4">
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="flex-1"
                  >
                    Edit Goal
                  </Button>
                  <Button
                    onClick={handleContinue}
                    className="flex-1"
                  >
                    Continue to Next Steps
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

export default CurrentGoal;