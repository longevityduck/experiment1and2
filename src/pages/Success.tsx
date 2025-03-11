
import { Card, CardContent } from "@/components/ui/card";

const Success = () => {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold">Thank you for participating in our study.</h1>
            <div className="mt-8 mb-8">
              <p className="text-lg mb-2">Please note down this reference code:</p>
              <p className="text-5xl font-bold text-primary py-4">C7HG4</p>
              <p className="text-lg">to key into the survey platform, when asked.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;
