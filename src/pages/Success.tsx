
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
            <h1 className="text-2xl font-bold">Thank You!</h1>
            <div className="space-y-4">
              <p>
                Your career guidance session is complete. Here's what happens next:
              </p>
              <div className="text-left">
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    We'll review your responses and prepare personalized
                    recommendations
                  </li>
                  <li>
                    You'll receive a WhatsApp message with detailed next steps and resources
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
                onClick={() => window.open("https://www.careergrit.sg", "_blank")}
              >
                More Career Resources
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;
