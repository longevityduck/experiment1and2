
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  nextButtonText?: string;
  disabled?: boolean;
  isNextSubmit?: boolean;  // Added isNextSubmit prop
}

export const NavigationButtons = ({ 
  onBack, 
  onNext, 
  nextButtonText = "Next",
  disabled = false,
  isNextSubmit = false  // Added with default value
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
        type={isNextSubmit ? "submit" : "button"}  // Use submit type if isNextSubmit is true
        className="w-full"
        onClick={isNextSubmit ? undefined : onNext}  // Don't use onClick for submit buttons
        disabled={disabled}
      >
        {nextButtonText}
      </Button>
    </div>
  );
};
