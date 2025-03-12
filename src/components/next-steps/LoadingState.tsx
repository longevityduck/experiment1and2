
import { Loader2 } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 min-h-[300px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-gray-600">Generating your personalized SMART career plan...</p>
      <p className="text-sm text-gray-500 max-w-md text-center">
        Creating specific, measurable, achievable, relevant, and time-bound steps 
        tailored to your career goals and experience level.
      </p>
    </div>
  );
};

export default LoadingState;
