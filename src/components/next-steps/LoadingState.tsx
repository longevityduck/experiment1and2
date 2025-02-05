import { Loader2 } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 min-h-[300px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-gray-600">Generating your personalized career plan...</p>
    </div>
  );
};

export default LoadingState;