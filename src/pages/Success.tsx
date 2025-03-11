
import { Card, CardContent } from "@/components/ui/card";

const Success = () => {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold">Thank you for participating in our study.</h1>
            <p className="text-lg">
              Please note down this reference code: <span className="font-bold">C7HG4</span> to key into the survey platform, when asked.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;
