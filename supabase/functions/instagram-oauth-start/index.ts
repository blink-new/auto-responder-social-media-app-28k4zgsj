
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const FACEBOOK_APP_ID = Deno.env.get("FACEBOOK_APP_ID");
// IMPORTANT: Replace with your actual Supabase function URL for the callback
const REDIRECT_URI = `${Deno.env.get("SUPABASE_URL")}/functions/v1/instagram-oauth-callback`;
const SCOPES = "instagram_basic,pages_show_list,instagram_manage_comments"; // Add other scopes as needed

console.log("instagram-oauth-start function invoked");

serve(async (req: Request) => {
  if (!FACEBOOK_APP_ID) {
    console.error("FACEBOOK_APP_ID not set in environment variables.");
    return new Response(JSON.stringify({ error: "Server configuration error." }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  const authUrl = new URL("https://www.facebook.com/v19.0/dialog/oauth");
  authUrl.searchParams.set("client_id", FACEBOOK_APP_ID);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("scope", SCOPES);
  authUrl.searchParams.set("response_type", "code");
  // You can add a 'state' parameter here for CSRF protection if needed

  console.log(`Redirecting to: ${authUrl.toString()}`);

  return Response.redirect(authUrl.toString(), 302);
});
