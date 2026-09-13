import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ubuejhoqdcpbhhkztddx.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVidWVqaG9xZGNwYmhoa3p0ZGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyNTExNTQsImV4cCI6MjEwNDgyNzE1NH0.zduCCrXnwP8M1j6LLmCHVN1Wwur9fycYA1Mav7vdJmI'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
