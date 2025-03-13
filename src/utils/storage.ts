
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
        const { data: existingEntry, error: queryError } = await supabase
          .from('career_guidance')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle() as { data: { id: string } | null, error: any };
          
        if (queryError) {
          console.error("Error checking for existing entry:", queryError);
          return newData;
        }
          
        if (existingEntry) {
          // Update existing entry
          const { error: updateError } = await supabase
            .from('career_guidance')
            .update({ 
              guidance_answers: newData,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id) as any;
            
          if (updateError) {
            console.error("Error updating Supabase:", updateError);
          } else {
            console.log("Successfully updated career guidance in Supabase");
          }
        } else {
          // Create new entry
          const { error: insertError } = await supabase
            .from('career_guidance')
            .insert([{ 
              user_id: user.id, 
              guidance_answers: newData,
              desired_job: newData.desiredJob || null
            }]) as any;
            
          if (insertError) {
            console.error("Error inserting to Supabase:", insertError);
          } else {
            console.log("Successfully created career guidance entry in Supabase");
          }
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
    // First try to load data from localStorage
    const data = localStorage.getItem(STORAGE_KEY);
    let localData = data ? JSON.parse(data) : {};
    
    // Return locally cached data immediately
    return localData;
  },
  
  // Function to load user data from Supabase (can be called on app initialization)
  loadUserData: async (): Promise<CareerInfo | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('career_guidance')
        .select('guidance_answers, desired_job, user_steps')
        .eq('user_id', user.id)
        .maybeSingle() as any;
      
      if (error) {
        console.error("Error loading from Supabase:", error);
        return null;
      }
      
      if (data) {
        // If we have data in Supabase, update localStorage
        const careerInfo = data.guidance_answers || {};
        if (data.desired_job) careerInfo.desiredJob = data.desired_job;
        
        // Save the data to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(careerInfo));
        
        // Also save steps if they exist
        if (data.user_steps) {
          localStorage.setItem("userSteps", JSON.stringify(data.user_steps));
        }
        
        console.log("Loaded user data from Supabase:", careerInfo);
        return careerInfo;
      }
      
      return null;
    } catch (error) {
      console.error("Error in loadUserData:", error);
      return null;
    }
  },

  clearCareerInfo: async () => {
    // Clear from localStorage
    localStorage.removeItem(STORAGE_KEY);
    
    // Clear from Supabase if user is logged in
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('career_guidance')
          .update({ 
            guidance_answers: null,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id) as any;
          
        if (error) {
          console.error("Error clearing Supabase data:", error);
        }
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
        const { error } = await supabase
          .from('career_guidance')
          .update({ 
            guidance_answers: null,
            user_steps: null,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id) as any;
          
        if (error) {
          console.error("Error resetting responses in Supabase:", error);
        } else {
          console.log("Successfully reset responses in Supabase");
        }
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
        console.log("Saving steps to Supabase:", steps);
        
        const { data: existingEntry, error: queryError } = await supabase
          .from('career_guidance')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle() as { data: { id: string } | null, error: any };
          
        if (queryError) {
          console.error("Error checking for existing entry:", queryError);
          return;
        }
          
        if (existingEntry) {
          // Update existing entry with steps
          const { error: updateError } = await supabase
            .from('career_guidance')
            .update({ 
              user_steps: steps,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id) as any;
            
          if (updateError) {
            console.error("Error updating steps in Supabase:", updateError);
          } else {
            console.log("Successfully saved steps to Supabase");
          }
        } else {
          // Create new entry for the user with steps
          const { error: insertError } = await supabase
            .from('career_guidance')
            .insert([{ 
              user_id: user.id,
              user_steps: steps,
              guidance_answers: {} // Initialize with empty object
            }]) as any;
            
          if (insertError) {
            console.error("Error inserting steps to Supabase:", insertError);
          } else {
            console.log("Successfully created new entry with steps in Supabase");
          }
        }
      } else {
        console.log("User not logged in, steps saved only to localStorage");
      }
    } catch (error) {
      console.error("Error saving steps to Supabase:", error);
    }
  }
};
