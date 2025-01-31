import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const UserType = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto pt-12">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Welcome Back!</CardTitle>
            <CardDescription className="text-lg">
              Are you a new or returning user?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4">
              <Button
                onClick={() => navigate("/personal-info")}
                className="py-8 text-lg"
              >
                I'm New Here
              </Button>
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                className="py-8 text-lg"
              >
                I'm a Returning User
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserType;