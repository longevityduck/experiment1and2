import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onReset: () => void;
  onCommit: () => void;
}

const ActionButtons = ({ onReset, onCommit }: ActionButtonsProps) => {
  return (
    <div className="flex">
      <Button onClick={onCommit} className="w-full">
        Commit to These Steps
      </Button>
    </div>
  );
};

export default ActionButtons;