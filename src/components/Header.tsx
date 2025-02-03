import { NorthStar } from "lucide-react";

const Header = () => {
  return (
    <div className="flex justify-between items-center w-full px-6 py-4">
      <div className="flex items-center gap-2">
        <NorthStar className="h-6 w-6 text-blue-600" />
        <span className="text-xl font-bold text-blue-600">North Star</span>
      </div>
    </div>
  );
};

export default Header;