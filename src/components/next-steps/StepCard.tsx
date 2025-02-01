import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical, Pencil, Save, X, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  onDelete: (step: Step) => void;
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
  onDelete,
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
          <div className="relative w-32">
            <Input
              value={editingTimeframe.replace(' months', '')}
              onChange={handleTimeframeChange}
              className="pr-16"
              placeholder="e.g. 3"
              type="number"
              min="1"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              months
            </span>
          </div>
          <Button size="icon" variant="ghost" onClick={() => onSave(step)}>
            <Save className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => onCancel(step)}>
            <X className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="ghost">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Step</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this step? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(step)} className="bg-red-500 hover:bg-red-600">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <GripVertical className="h-5 w-5 text-gray-400" />
          <div className="flex-1">
            <span className="text-gray-700">{step.content}</span>
            <span className="ml-2 text-sm text-gray-500">({step.timeframe})</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" onClick={() => onEdit(step)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="ghost">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Step</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this step? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(step)} className="bg-red-500 hover:bg-red-600">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
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