
import { CareerInfo } from "../types/career";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "careerInfo";

export const storage = {
  saveCareerInfo: async (data: Partial<CareerInfo>) => {
    // First save to localStorage for offline support
    const existingData = storage.getCareerInfo();
    const newData = { ...existingData, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    
    // Then try to save to Supabase if user is authenticated
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('career_assessments')
          .upsert({ 
            user_id: user.id,
            assessment_data: newData,
            updated_at: new Date().toISOString()
          }, { 
            onConflict: 'user_id'
          });
          
        if (error) {
          console.error("Error saving to Supabase:", error);
        }
      }
    } catch (error) {
      console.error("Error saving to Supabase:", error);
      // Continue with local storage only
    }
  },

  getCareerInfo: (): CareerInfo => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  },
  
  getCareerInfoFromSupabase: async (): Promise<CareerInfo | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('career_assessments')
        .select('assessment_data')
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        console.error("Error retrieving from Supabase:", error);
        return null;
      }
      
      return data?.assessment_data as CareerInfo || null;
    } catch (error) {
      console.error("Error retrieving from Supabase:", error);
      return null;
    }
  },
  
  syncFromSupabase: async (): Promise<boolean> => {
    try {
      const supabaseData = await storage.getCareerInfoFromSupabase();
      if (supabaseData) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(supabaseData));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error syncing from Supabase:", error);
      return false;
    }
  },

  clearCareerInfo: async () => {
    localStorage.removeItem(STORAGE_KEY);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('career_assessments')
          .delete()
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error("Error clearing data from Supabase:", error);
    }
  },
  
  resetAllResponses: async () => {
    // Clear from localStorage
    localStorage.removeItem(STORAGE_KEY);
    
    // Clear from Supabase if user is authenticated
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('career_assessments')
          .delete()
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error("Error resetting data in Supabase:", error);
    }
    
    console.log("All responses have been reset");
  }
};
