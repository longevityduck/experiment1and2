import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import Header from "@/components/Header";

const ReturningUserOptions = () => {
  const navigate = useNavigate();

  const handleStartFresh = () => {
    localStorage.clear(); // Clear all existing data
    navigate("/personal-info");
  };

  const handleReviewPlan = () => {
    const careerGoals = localStorage.getItem("careerGoals");
    if (!careerGoals) {
      toast.error("No existing plan found. Please start fresh.");
      handleStartFresh();
      return;
    }
    navigate("/career-goals");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <Header />
      <div className="max-w-2xl mx-auto pt-12">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Welcome Back!</CardTitle>
            <CardDescription className="text-lg">
              What would you like to do today?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleReviewPlan}
              className="w-full py-6 text-lg"
            >
              Review My Career Goal
            </Button>
            <Button
              onClick={() => navigate("/next-steps")}
              variant="outline"
              className="w-full py-6 text-lg"
            >
              Update My Career Plan
            </Button>
            <Button
              onClick={handleStartFresh}
              variant="outline"
              className="w-full py-6 text-lg"
            >
              Start Fresh
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReturningUserOptions;