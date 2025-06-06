import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient, SupabaseClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

// IMPORTANT: In a real app with user authentication, this would be dynamically determined.
const USER_ID_PLACEHOLDER = "00000000-0000-0000-0000-000000000000";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS", // Only GET and OPTIONS for this one
};

console.log("instagram-get-profile function invoked");

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Fetch the Instagram connection details for the placeholder user
    const { data: connectionData, error: connectionError } = await supabaseAdmin
      .from("social_connections")
      .select("credentials_secret_name, platform_username") // This is the long-lived token
      .eq("user_id", USER_ID_PLACEHOLDER)
      .eq("platform_id", "instagram")
      .single();

    if (connectionError || !connectionData) {
      console.error("Error fetching Instagram connection:", connectionError);
      return new Response(JSON.stringify({ error: "Instagram connection not found or error fetching it." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    const accessToken = connectionData.credentials_secret_name;
    if (!accessToken) {
      return new Response(JSON.stringify({ error: "Access token not found for Instagram connection." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // 2. Use the access token to get Instagram User ID and Username
    // This confirms the token is (still) valid and fetches basic info.
    const igMeResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
    );

    if (!igMeResponse.ok) {
      const errorText = await igMeResponse.text();
      console.error("Failed to get Instagram user info with stored token:", errorText);
      // Potentially mark the connection as invalid/expired here
      return new Response(JSON.stringify({ error: `Failed to get Instagram user info: ${errorText}` }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: igMeResponse.status, // Forward Instagram's error status
      });
    }

    const igUserData = await igMeResponse.json();
    console.log("Successfully fetched Instagram profile:", igUserData);

    return new Response(JSON.stringify(igUserData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in instagram-get-profile function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
