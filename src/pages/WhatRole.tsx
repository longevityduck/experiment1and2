
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FormContainer } from "@/components/career-guidance/FormContainer";
import { NavigationButtons } from "@/components/career-guidance/NavigationButtons";
import { Input } from "@/components/ui/input";
import { storage } from "@/utils/storage";
import { ProgressIndicator } from "@/components/career-guidance/ProgressIndicator";

const WhatRole = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    const savedInfo = storage.getCareerInfo();
    if (savedInfo.desiredRole) {
      setRole(savedInfo.desiredRole);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role.trim()) {
      toast.error("Please enter your desired job");
      return;
    }

    storage.saveCareerInfo({ desiredRole: role });
    navigate("/career-clarification");
  };

  return (
    <>
      <ProgressIndicator />
      <FormContainer title="What Job Are You Considering?">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-2">
              <p>Please be as specific as possible when describing your desired job.</p>
              <p>For example, instead of just "Manager", try "Finance Manager" or "Marketing Manager".</p>
            </div>
            
            <Input
              type="text"
              placeholder="Enter your desired job"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            
            <div className="text-sm text-gray-600 space-y-2">
              <p>Not sure about which job suits you?</p>
              <p>Try exploring suitable jobs at{" "}
                <a 
                  href="https://careersfinder.mycareersfuture.gov.sg/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  CareersFinder
                </a>
              </p>
            </div>
          </div>

          <NavigationButtons
            onBack={() => navigate("/career-guidance")}
            onNext={() => {}}
          />
        </form>
      </FormContainer>
    </>
  );
};

export default WhatRole;
