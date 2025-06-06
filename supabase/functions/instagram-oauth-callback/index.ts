import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient, SupabaseClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

const FACEBOOK_APP_ID = Deno.env.get("FACEBOOK_APP_ID")!;
const FACEBOOK_APP_SECRET = Deno.env.get("FACEBOOK_APP_SECRET")!;

// IMPORTANT: In a real app with user authentication, this would be dynamically determined.
const USER_ID_PLACEHOLDER = "00000000-0000-0000-0000-000000000000"; // Replace with a valid UUID if you have a test user, or handle dynamically

console.log("instagram-oauth-callback function invoked");

serve(async (req: Request) => {
  const appPreviewUrl = "https://3000-i28ladg46z76xt0dj8qdg-ac85d35c.blink.new"; // Hardcoded for now
  let appRedirectUrl = new URL(`${appPreviewUrl}/social`);

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
      console.error("Missing code parameter");
      appRedirectUrl.searchParams.set("instagram_auth_status", "error");
      appRedirectUrl.searchParams.set("error_message", "Missing authorization code.");
      return Response.redirect(appRedirectUrl.toString(), 302);
    }

    // 1. Exchange code for short-lived access token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(supabaseUrl + "/functions/v1/instagram-oauth-callback")}&client_secret=${FACEBOOK_APP_SECRET}&code=${code}`
    );
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Failed to get short-lived access token:", errorText);
      throw new Error(`Failed to get short-lived access token: ${errorText}`);
    }
    const tokenData = await tokenResponse.json();
    const shortLivedToken = tokenData.access_token;

    // 2. Exchange short-lived token for long-lived token
    const longLivedResponse = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&fb_exchange_token=${shortLivedToken}`
    );
    if (!longLivedResponse.ok) {
      const errorText = await longLivedResponse.text();
      console.error("Failed to get long-lived token:", errorText);
      throw new Error(`Failed to get long-lived token: ${errorText}`);
    }
    const longLivedData = await longLivedResponse.json();
    const longLivedToken = longLivedData.access_token;

    // 3. Get Instagram User ID and Username using the long-lived token
    const igMeResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${longLivedToken}`
    );
    if (!igMeResponse.ok) {
      const errorText = await igMeResponse.text();
      console.error("Failed to get Instagram user info:", errorText);
      throw new Error(`Failed to get Instagram user info: ${errorText}`);
    }
    const igUserData = await igMeResponse.json();
    const instagramUserId = igUserData.id; // This is the Instagram User ID, not your app's user_id
    const instagramUsername = igUserData.username;

    // 4. Store the connection details in Supabase
    // We use a placeholder for your application's user_id for now.
    // In a real app, this user_id would come from the authenticated user session.
    const { error: dbError } = await supabaseAdmin
      .from("social_connections")
      .upsert({
        user_id: USER_ID_PLACEHOLDER, 
        platform_id: "instagram",
        platform_username: instagramUsername,
        is_connected: true,
        credentials_secret_name: longLivedToken, // Storing token directly for now; consider more secure storage for production
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,platform_id' }); // Upsert based on user_id and platform_id

    if (dbError) {
      console.error("Database error storing social connection:", dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log("Successfully connected Instagram and stored token for user:", USER_ID_PLACEHOLDER);
    appRedirectUrl.searchParams.set("instagram_auth_status", "success");
    appRedirectUrl.searchParams.set("platform_id", "instagram");
    return Response.redirect(appRedirectUrl.toString(), 302);

  } catch (error) {
    console.error("Error in instagram-oauth-callback:", error.message);
    appRedirectUrl.searchParams.set("instagram_auth_status", "error");
    appRedirectUrl.searchParams.set("error_message", error.message);
    return Response.redirect(appRedirectUrl.toString(), 302);
  }
});