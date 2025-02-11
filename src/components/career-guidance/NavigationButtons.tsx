
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  nextButtonText?: string;
  disabled?: boolean;  // Added disabled prop
}

export const NavigationButtons = ({ 
  onBack, 
  onNext, 
  nextButtonText = "Next",
  disabled = false  // Added with default value
}: NavigationButtonsProps) => {
  return (
    <div className="flex gap-4">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={onBack}
        disabled={disabled}
      >
        Back
      </Button>
      <Button 
        type="submit" 
        className="w-full"
        onClick={onNext}
        disabled={disabled}
      >
        {nextButtonText}
      </Button>
    </div>
  );
};
