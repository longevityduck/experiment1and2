import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

const UserType = () => {
  const navigate = useNavigate();

  const handleNewUser = () => {
    localStorage.clear(); // Clear any existing data
    navigate("/personal-info");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 relative">
      <div className="max-w-2xl mx-auto pt-12">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Welcome!</CardTitle>
            <CardDescription className="text-lg">
              Are you a new or returning user?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4">
              <Button
                onClick={handleNewUser}
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
        <div className="text-center mt-4">
          <Link to="/terms-of-use" className="text-primary hover:underline">
            Terms of Use
          </Link>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 text-sm text-gray-500">
        © 2025 Jon Huang
      </div>
    </div>
  );
};

export default UserType;