import 'react-native-url-polyfill/auto'; // Required for Supabase to work in React Native
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase URL or Anon Key is missing. Make sure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set in your .env file or environment variables.'
  );
  // You might want to throw an error here or handle it gracefully
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!); // Use ! to assert they are defined, after the check

export { supabaseUrl as supaUrl }; // Exporting the URL separately for use in other places if needed
