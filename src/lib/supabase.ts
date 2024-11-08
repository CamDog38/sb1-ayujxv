import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ewgwohggjkxkeqagekiy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3Z3dvaGdnamt4a2VxYWdla2l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4OTI0MTIsImV4cCI6MjA0NjQ2ODQxMn0.k_t3PhVerFnl9_LpBjYXsxm4KuzYOpQrBJGhJ5K7FRg';

export const supabase = createClient(supabaseUrl, supabaseKey);