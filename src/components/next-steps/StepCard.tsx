import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Save, X } from "lucide-react";

interface Step {
  id: number;
  content: string;
  timeframe: string;
  isEditing: boolean;
  explanation?: string;
  isOriginal?: boolean;
}

interface StepCardProps {
  step: Step;
  editingContent: string;
  editingTimeframe: string;
  onEdit: (step: Step) => void;
  onSave: (step: Step) => void;
  onCancel: (step: Step) => void;
  setEditingContent: (content: string) => void;
  setEditingTimeframe: (timeframe: string) => void;
}

const StepCard = ({
  step,
  editingContent,
  editingTimeframe,
  onEdit,
  onSave,
  onCancel,
  setEditingContent,
  setEditingTimeframe,
}: StepCardProps) => {
  const handleTimeframeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue) {
      setEditingTimeframe(`${numericValue} months`);
    } else {
      setEditingTimeframe('');
    }
  };

  if (step.isEditing) {
    return (
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Input
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            className="flex-1"
            placeholder="Enter step description"
          />
          <Input
            value={editingTimeframe.replace(' months', '')}
            onChange={handleTimeframeChange}
            className="w-32"
            placeholder="e.g. 3"
            type="number"
            min="1"
          />
          <Button size="icon" variant="ghost" onClick={() => onSave(step)}>
            <Save className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => onCancel(step)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <span className="text-gray-700">{step.content}</span>
          <span className="ml-2 text-sm text-gray-500">({step.timeframe})</span>
        </div>
        <Button size="icon" variant="ghost" onClick={() => onEdit(step)}>
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
      {step.isOriginal && step.explanation && (
        <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded">
          {step.explanation}
        </p>
      )}
    </>
  );
};

export default StepCard;