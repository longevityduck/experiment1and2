import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl">Congratulations!</CardTitle>
            <CardDescription className="text-lg mt-2">
              You've taken the first step towards achieving your career goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                We'll keep you updated with personalized insights and opportunities
                to help you reach your goals. Feel free to return anytime to update
                your plan or track your progress.
              </p>
              <div className="space-y-2">
                <p className="font-medium">What happens next?</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• You'll receive updates via text message</li>
                  <li>• We'll share relevant resources and opportunities</li>
                  <li>• You can return anytime to update your plan</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-center pt-4">
              <Button onClick={() => navigate("/")}>
                Return to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Success;