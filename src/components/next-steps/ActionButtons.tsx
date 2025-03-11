
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ActionButtonsProps {
  onCommit: () => void;
}

const ActionButtons = ({ onCommit }: ActionButtonsProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <Button onClick={onCommit} className="w-full">
        I have completed defining my next career steps
      </Button>
    </div>
  );
};

export default ActionButtons;
