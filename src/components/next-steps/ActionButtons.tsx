import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ActionButtonsProps {
  onReset: () => void;
  onCommit: () => void;
}

const ActionButtons = ({ onReset, onCommit }: ActionButtonsProps) => {
  return (
    <div className="flex gap-4">
      <Button onClick={onReset} className="w-full" variant="outline">
        Start Over
      </Button>
      <Button onClick={onCommit} className="w-full">
        Commit to These Steps
      </Button>
    </div>
  );
};

export default ActionButtons;