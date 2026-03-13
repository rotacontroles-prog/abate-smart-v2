import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qfaqbgipzprekwevhbrf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmYXFiZ2lwenByZWt3ZXZoYnJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjkyNTIsImV4cCI6MjA4OTAwNTI1Mn0.awl4my2sG2vKL3j7EzwEwXI5wkrcqIgJrsRVlnuz6mc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
