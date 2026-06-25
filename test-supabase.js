const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://lvodpjrvwwyjypklljaz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2b2RwanJ2d3d5anlwa2xsamF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMTc4NjQsImV4cCI6MjA5Nzg5Mzg2NH0.T9eS6Xl36Xe3gs2LOeefbPBCpek-Oqz5HMEBO8CA4vw'
);

async function test() {
  const { data, error } = await supabase.auth.signUp({
    email: 'test@example.com',
    password: 'password123'
  });
  console.log('Result:', { data, error });
}
test();
