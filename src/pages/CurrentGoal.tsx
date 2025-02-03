import { useState, useEffect } from "react";
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
import Header from "@/components/Header";

const CurrentGoal = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [goal, setGoal] = useState("");

  useEffect(() => {
    const savedGoal = localStorage.getItem("currentGoal");
    if (savedGoal) {
      setGoal(savedGoal);
    }
  }, []);

  const handleSave = () => {
    if (!goal.trim()) {
      toast.error("Please enter a goal before saving");
      return;
    }
    
    try {
      localStorage.setItem("currentGoal", goal);
      toast.success("Goal updated successfully!");
      navigate("/next-steps");
    } catch (error) {
      toast.error("Failed to save goal. Please try again.");
      console.error("Error saving goal:", error);
    }
  };

  const handleContinue = () => {
    if (!goal.trim()) {
      toast.error("Please enter a goal before continuing");
      return;
    }
    localStorage.setItem("currentGoal", goal);
    navigate("/next-steps");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <div className="p-6">
        <div className="max-w-2xl mx-auto pt-12">
          <Card>
            <CardHeader>
              <CardTitle>Your Current Career Goal</CardTitle>
              <CardDescription>
                {isEditing
                  ? "Edit your career goal below:"
                  : "Review your current career goal:"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="min-h-[100px]"
                    placeholder="Enter your career goal..."
                  />
                  <div className="flex gap-4">
                    <Button onClick={handleSave} className="flex-1">
                      Save Goal
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="min-h-[100px] p-4 bg-gray-50 rounded-md">
                    {goal || "No goal set yet"}
                  </div>
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
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CurrentGoal;