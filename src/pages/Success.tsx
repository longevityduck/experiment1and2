
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold">Your Career Goals Are Set!</h1>
            <div className="space-y-4">
              <p>
                Congratulations on completing your career goal definition process. You now have:
              </p>
              <div className="text-left">
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    A clearer understanding of your career aspirations
                  </li>
                  <li>
                    A well-defined career goal to guide your professional development
                  </li>
                  <li>
                    A foundation for planning your next career steps
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col gap-3 justify-center pt-4">
              <Button onClick={() => navigate("/introduction")}>
                Return to Homepage
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/career-goal-suggestion")}
              >
                Review My Career Goal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;
