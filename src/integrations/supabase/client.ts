
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://elcrdezviouijqapmxsq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsY3JkZXp2aW91aWpxYXBteHNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2ODY5ODksImV4cCI6MjA1NzI2Mjk4OX0.l6WAvsRqTArN1wr5ygbLJHQlI6z6SF_XlkEnrIw_dmA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Type definitions for custom tables that aren't in the auto-generated types
export type CareerGuidanceRow = {
  id: string;
  user_id: string;
  guidance_answers: any;
  desired_job: string | null;
  created_at: string;
  updated_at: string;
}
