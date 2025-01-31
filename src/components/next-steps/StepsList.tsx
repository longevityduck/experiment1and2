import { useToast } from "@/hooks/use-toast";
import StepCard from "./StepCard";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";

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

  const handleAddStep = () => {
    if (steps.length >= 9) {
      toast({
        title: "Maximum Steps Reached",
        description: "You can't add more than 9 steps",
        variant: "destructive",
      });
      return;
    }

    const newStep: Step = {
      id: Date.now(),
      content: "",
      timeframe: "1 months",
      isEditing: true,
      isOriginal: false,
    };

    setSteps([...steps, newStep]);
    setEditingContent("");
    setEditingTimeframe("1 months");
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSteps(items);
  };

  return (
    <div className="space-y-4 mb-6">
      {steps.length < 9 && (
        <Button
          variant="outline"
          className="w-full border-dashed"
          onClick={handleAddStep}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Step
        </Button>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="steps">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {steps.map((step, index) => (
                <Draggable
                  key={step.id}
                  draggableId={step.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="mb-4"
                    >
                      <div className="flex flex-col p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
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
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default StepsList;