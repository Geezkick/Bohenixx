const { createBrowserClient } = require('@supabase/ssr');
try {
  createBrowserClient(undefined, undefined);
  console.log("Success");
} catch (e) {
  console.log("Error:", e.message);
}
