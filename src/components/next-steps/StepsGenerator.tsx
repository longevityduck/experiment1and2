
import { useStepGenerator } from "@/hooks/useStepGenerator";
import { Step } from "@/types/steps";

interface StepsGeneratorProps {
  onStepsGenerated: (steps: Step[]) => void;
  setLoading: (loading: boolean) => void;
}

const StepsGenerator = ({ onStepsGenerated, setLoading }: StepsGeneratorProps) => {
  // Use our custom hook to handle step generation
  useStepGenerator({ onStepsGenerated, setLoading });

  // This component doesn't render anything
  return null;
};

export default StepsGenerator;
