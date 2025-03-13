
import { CareerInfo } from "../types/career";
import { supabase, type CareerGuidanceRow } from "../integrations/supabase/client";

const STORAGE_KEY = "careerInfo";

export const storage = {
  saveCareerInfo: async (data: Partial<CareerInfo>) => {
    // Save to localStorage for quick access and offline support
    const existingData = storage.getCareerInfo();
    const newData = { ...existingData, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    
    // Save to Supabase in real-time
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log("Saving to Supabase:", newData);
        
        // Check if entry exists for this user
        const { data: existingEntry } = await supabase
          .from('career_guidance')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle() as { data: { id: string } | null };
          
        if (existingEntry) {
          // Update existing entry
          await supabase
            .from('career_guidance')
            .update({ 
              guidance_answers: newData,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id) as any;
        } else {
          // Create new entry
          await supabase
            .from('career_guidance')
            .insert([{ 
              user_id: user.id, 
              guidance_answers: newData,
              desired_job: newData.desiredJob || null
            }]) as any;
        }
      } else {
        console.log("User not logged in, data saved only to localStorage");
      }
    } catch (error) {
      console.error("Error saving to Supabase:", error);
      // Continue with localStorage even if Supabase fails
    }

    return newData;
  },

  getCareerInfo: (): CareerInfo => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  },

  clearCareerInfo: async () => {
    // Clear from localStorage
    localStorage.removeItem(STORAGE_KEY);
    
    // Clear from Supabase if user is logged in
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('career_guidance')
          .update({ 
            guidance_answers: null,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id) as any;
      }
    } catch (error) {
      console.error("Error clearing data in Supabase:", error);
    }
  },
  
  resetAllResponses: async () => {
    // Remove from localStorage
    localStorage.removeItem(STORAGE_KEY);
    
    // Clear from Supabase if user is logged in
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('career_guidance')
          .update({ 
            guidance_answers: null,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id) as any;
      }
    } catch (error) {
      console.error("Error resetting responses in Supabase:", error);
    }
    
    console.log("All responses have been reset");
  },
  
  // Function to save steps to both localStorage and Supabase
  saveSteps: async (steps: any[]) => {
    // Save to localStorage for quick access
    localStorage.setItem("userSteps", JSON.stringify(steps));
    
    // Save to Supabase if user is logged in
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: existingEntry } = await supabase
          .from('career_guidance')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle() as { data: { id: string } | null };
          
        if (existingEntry) {
          // Update existing entry with steps
          await supabase
            .from('career_guidance')
            .update({ 
              user_steps: steps,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id) as any;
        }
      }
    } catch (error) {
      console.error("Error saving steps to Supabase:", error);
    }
  }
};
