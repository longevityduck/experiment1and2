
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressIndicator } from "@/components/career-guidance/ProgressIndicator";
import { FormContainer } from "@/components/career-guidance/FormContainer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { storage } from "@/utils/storage";

const ConfidenceAssessment = () => {
  const navigate = useNavigate();
  const [confidenceLevel, setConfidenceLevel] = useState<number[]>([5]);
  const [readinessLevel, setReadinessLevel] = useState<number[]>([5]);
  
  useEffect(() => {
    // Load saved values if they exist
    const savedInfo = storage.getCareerInfo();
    if (savedInfo.confidenceLevel) {
      setConfidenceLevel([savedInfo.confidenceLevel]);
    }
    if (savedInfo.readinessLevel) {
      setReadinessLevel([savedInfo.readinessLevel]);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save both levels
    storage.saveCareerInfo({ 
      confidenceLevel: confidenceLevel[0],
      readinessLevel: readinessLevel[0]
    });
    
    // Navigate to the personal info page instead of next-steps
    navigate("/personal-info");
  };

  return (
    <>
      <ProgressIndicator />
      <FormContainer 
        title="Career Confidence Assessment"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">On a scale of 1 to 10, how confident are you in determining your next career steps?</h3>
            
            <div className="pt-6 pb-8">
              <Slider
                value={confidenceLevel}
                onValueChange={setConfidenceLevel}
                max={10}
                min={1}
                step={1}
              />
              
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>1 - Not confident</span>
                <span>10 - Very confident</span>
              </div>
              
              <div className="text-center mt-4 font-medium text-xl">
                {confidenceLevel[0]}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
              <h4 className="font-medium text-blue-900 mb-2">What do we mean by "Career Steps"?</h4>
              <p className="text-blue-800">
                Career steps refer to the key stages or actions you take in the process of planning, 
                making decisions, and progressing in your career.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-medium">On a scale of 1 to 10, how ready do you feel if you had to take your next career step within a month?</h3>
            
            <div className="pt-6 pb-8">
              <Slider
                value={readinessLevel}
                onValueChange={setReadinessLevel}
                max={10}
                min={1}
                step={1}
              />
              
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>1 - Unprepared</span>
                <span>10 - Very Prepared</span>
              </div>
              
              <div className="text-center mt-4 font-medium text-xl">
                {readinessLevel[0]}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </FormContainer>
    </>
  );
};

export default ConfidenceAssessment;
