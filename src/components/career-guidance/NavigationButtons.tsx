import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  nextButtonText?: string;
}

export const NavigationButtons = ({ 
  onBack, 
  onNext, 
  nextButtonText = "Next" 
}: NavigationButtonsProps) => {
  return (
    <div className="flex gap-4">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={onBack}
      >
        Back
      </Button>
      <Button 
        type="submit" 
        className="w-full"
        onClick={onNext}
      >
        {nextButtonText}
      </Button>
    </div>
  );
};