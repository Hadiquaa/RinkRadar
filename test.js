// test.js
import "dotenv/config"; // automatically loads .env
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  const { data, error } = await supabase.from("rinks").select("*").limit(1);
  if (error) {
    console.error("❌ DB Error:", error);
  } else {
    console.log("✅ DB Connected! Sample data:", data);
  }
}

testConnection();
