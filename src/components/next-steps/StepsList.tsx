import { useToast } from "@/hooks/use-toast";
import StepCard from "./StepCard";

interface Step {
  id: number;
  content: string;
  timeframe: string;
  isEditing: boolean;
  explanation?: string;
  isOriginal?: boolean;
}

interface StepsListProps {
  steps: Step[];
  setSteps: (steps: Step[]) => void;
  editingContent: string;
  editingTimeframe: string;
  setEditingContent: (content: string) => void;
  setEditingTimeframe: (timeframe: string) => void;
}

const StepsList = ({
  steps,
  setSteps,
  editingContent,
  editingTimeframe,
  setEditingContent,
  setEditingTimeframe,
}: StepsListProps) => {
  const { toast } = useToast();

  const handleEdit = (step: Step) => {
    setSteps(
      steps.map((s) => ({
        ...s,
        isEditing: s.id === step.id ? true : false,
      }))
    );
    setEditingContent(step.content);
    setEditingTimeframe(step.timeframe);
  };

  const handleSave = (step: Step) => {
    if (!editingContent.trim()) {
      toast({
        title: "Error",
        description: "Step content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (!editingTimeframe.trim()) {
      toast({
        title: "Error",
        description: "Timeframe cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // Validate timeframe format
    const timeframeNumber = parseInt(editingTimeframe.replace(' months', ''));
    if (isNaN(timeframeNumber) || timeframeNumber < 1) {
      toast({
        title: "Error",
        description: "Please enter a valid number of months",
        variant: "destructive",
      });
      return;
    }

    setSteps(
      steps.map((s) =>
        s.id === step.id
          ? {
              ...s,
              content: editingContent.trim(),
              timeframe: `${timeframeNumber} months`,
              isEditing: false,
              isOriginal: false,
            }
          : s
      )
    );
    setEditingContent("");
    setEditingTimeframe("");
  };

  const handleCancel = (step: Step) => {
    setSteps(
      steps.map((s) => (s.id === step.id ? { ...s, isEditing: false } : s))
    );
    setEditingContent("");
    setEditingTimeframe("");
  };

  return (
    <div className="space-y-4 mb-6">
      {steps.map((step) => (
        <div
          key={step.id}
          className="flex flex-col p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
        >
          <StepCard
            step={step}
            editingContent={editingContent}
            editingTimeframe={editingTimeframe}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            setEditingContent={setEditingContent}
            setEditingTimeframe={setEditingTimeframe}
          />
        </div>
      ))}
    </div>
  );
};

export default StepsList;