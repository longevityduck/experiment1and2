
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ActionButtonsProps {
  onReset: () => void;
  onCommit: () => void;
}

const ActionButtons = ({ onReset, onCommit }: ActionButtonsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col space-y-4">
      <Button onClick={onCommit} className="w-full">
        Commit to These Steps
      </Button>
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => navigate("/career-confidence-assessment")}
        >
          Back to Assessment
        </Button>
        <Button 
          variant="outline"
          className="w-full" 
          onClick={onReset}
        >
          Reset Steps
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
