import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ReturningUserOptions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
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
              onClick={() => navigate("/current-goal")}
              className="w-full py-6 text-lg"
            >
              Review My Current Plan
            </Button>
            <Button
              onClick={() => navigate("/next-steps")}
              variant="outline"
              className="w-full py-6 text-lg"
            >
              Update My Next Steps
            </Button>
            <Button
              onClick={() => navigate("/personal-info")}
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