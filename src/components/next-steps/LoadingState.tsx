import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const LoadingState = () => {
  const [loadingMessage, setLoadingMessage] = useState("Generating your personalized career plan...");
  
  useEffect(() => {
    // Show different messages as time passes to keep the user informed
    const messageTimer = setTimeout(() => {
      setLoadingMessage("Still working on your custom career plan... This may take a few moments.");
    }, 5000);
    
    const secondMessageTimer = setTimeout(() => {
      setLoadingMessage("Creating tailored action steps for your specific situation...");
    }, 10000);
    
    return () => {
      clearTimeout(messageTimer);
      clearTimeout(secondMessageTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 min-h-[300px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-gray-600 text-center max-w-md">{loadingMessage}</p>
    </div>
  );
};

export default LoadingState;
