
import { CareerInfo } from "../types/career";
import { supabase } from "../integrations/supabase/client";

const STORAGE_KEY = "careerInfo";

export const storage = {
  saveCareerInfo: async (data: Partial<CareerInfo>) => {
    // Save to localStorage
    const existingData = storage.getCareerInfo();
    const newData = { ...existingData, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    
    // Save to Supabase if user is logged in
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check if entry exists for this user
        const { data: existingEntry } = await supabase
          .from('career_guidance')
          .select('id')
          .eq('user_id', user.id)
          .single();
          
        if (existingEntry) {
          // Update existing entry
          await supabase
            .from('career_guidance')
            .update({ 
              guidance_answers: newData,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
        } else {
          // Create new entry
          await supabase
            .from('career_guidance')
            .insert([{ 
              user_id: user.id, 
              guidance_answers: newData,
              desired_job: newData.desiredJob || null
            }]);
        }
      }
    } catch (error) {
      console.error("Error saving to Supabase:", error);
    }
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
          .eq('user_id', user.id);
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
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error("Error resetting responses in Supabase:", error);
    }
    
    console.log("All responses have been reset");
  }
};
