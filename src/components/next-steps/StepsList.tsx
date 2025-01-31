import { useToast } from "@/hooks/use-toast";
import StepCard from "./StepCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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

  const handleInsertStep = (index: number) => {
    if (steps.length >= 9) {
      toast({
        title: "Maximum Steps Reached",
        description: "You cannot add more than 9 steps",
        variant: "destructive",
      });
      return;
    }

    const newStep: Step = {
      id: Math.max(...steps.map((s) => s.id)) + 1,
      content: "",
      timeframe: "1 months",
      isEditing: true,
      isOriginal: false,
    };

    const newSteps = [...steps];
    newSteps.splice(index, 0, newStep);
    setSteps(newSteps);
    setEditingContent("");
    setEditingTimeframe("1 months");
  };

  return (
    <div className="space-y-2 mb-6">
      <Button
        variant="ghost"
        size="sm"
        className="w-full border border-dashed border-gray-300 hover:border-gray-400"
        onClick={() => handleInsertStep(0)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Insert Step Here
      </Button>
      
      {steps.map((step, index) => (
        <div key={step.id}>
          <div className="flex flex-col p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
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
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full border border-dashed border-gray-300 hover:border-gray-400 mt-2"
            onClick={() => handleInsertStep(index + 1)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Insert Step Here
          </Button>
        </div>
      ))}
    </div>
  );
};

export default StepsList;