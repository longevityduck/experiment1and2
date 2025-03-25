
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { logout } = useAuth();

  return (
    <div className="absolute top-4 right-4">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={logout}
        className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
      >
        <LogOut size={16} />
        <span>Logout</span>
      </Button>
    </div>
  );
};

export default Header;
