import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qxugkcmbzvaxpsmopgyr.supabase.co";
const supabaseSecretKey =
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    .eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4dWdrY21ienZheHBzbW9wZ3lyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2ODY3NzQwNSwiZXhwIjoxOTg0MjUzNDA1fQ
    .dsyMrzxTnQNF9yRZxer4lYGTf7Jry6aVQRNezgGALRE;

export const supabase = createClient(supabaseUrl, supabaseSecretKey);
