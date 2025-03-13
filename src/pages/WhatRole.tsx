
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FormContainer } from "@/components/career-guidance/FormContainer";
import { NavigationButtons } from "@/components/career-guidance/NavigationButtons";
import { Input } from "@/components/ui/input";
import { storage } from "@/utils/storage";
import { ProgressIndicator } from "@/components/career-guidance/ProgressIndicator";
import { supabase, type CareerGuidanceRow } from "@/integrations/supabase/client";

const WhatRole = () => {
  const navigate = useNavigate();
  const [job, setJob] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSavedJob = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // If no user is logged in, try to get from local storage as fallback
          const savedInfo = storage.getCareerInfo();
          if (savedInfo.desiredJob) {
            setJob(savedInfo.desiredJob);
          }
          return;
        }

        const { data, error } = await supabase
          .from('career_guidance')
          .select('desired_job')
          .eq('user_id', user.id)
          .maybeSingle() as { data: Pick<CareerGuidanceRow, 'desired_job'> | null, error: any };

        if (error) {
          console.error('Error loading job data:', error);
          return;
        }

        if (data?.desired_job) {
          setJob(data.desired_job);
        }
      } catch (error) {
        console.error('Error in loadSavedJob:', error);
      }
    };

    loadSavedJob();
  }, []);

  // Save job as user types
  useEffect(() => {
    if (!job) return;
    
    const saveTimeout = setTimeout(() => {
      storage.saveCareerInfo({ desiredJob: job });
    }, 1000);
    
    return () => clearTimeout(saveTimeout);
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!job.trim()) {
      toast.error("Please enter your desired job");
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // First try to update existing record
        const { data, error: selectError } = await supabase
          .from('career_guidance')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle() as { data: { id: string } | null, error: any };

        if (data) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('career_guidance')
            .update({ desired_job: job })
            .eq('user_id', user.id) as any;

          if (updateError) throw updateError;
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from('career_guidance')
            .insert([
              { user_id: user.id, desired_job: job }
            ]) as any;

          if (insertError) throw insertError;
        }
      }
      
      // Always save to CareerInfo
      storage.saveCareerInfo({ desiredJob: job });

      navigate("/career-goal-suggestion");
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error("Failed to save your job preference. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
              value={job}
              onChange={(e) => setJob(e.target.value)}
              disabled={isLoading}
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
            isNextSubmit={true}
            disabled={isLoading}
          />
        </form>
      </FormContainer>
    </>
  );
};

export default WhatRole;
