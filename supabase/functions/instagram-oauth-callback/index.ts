import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const FACEBOOK_APP_ID = Deno.env.get("FACEBOOK_APP_ID")!;
const FACEBOOK_APP_SECRET = Deno.env.get("FACEBOOK_APP_SECRET")!;

serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code) {
      return new Response("Missing code parameter", { status: 400 });
    }

    // Exchange code for short-lived access token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(supabaseUrl + "/functions/v1/instagram-oauth-callback")}&client_secret=${FACEBOOK_APP_SECRET}&code=${code}`
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      return new Response(`Failed to get access token: ${errorText}`, { status: 500 });
    }

    const tokenData = await tokenResponse.json();
    const shortLivedToken = tokenData.access_token;

    // Exchange short-lived token for long-lived token
    const longLivedResponse = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&fb_exchange_token=${shortLivedToken}`
    );

    if (!longLivedResponse.ok) {
      const errorText = await longLivedResponse.text();
      return new Response(`Failed to get long-lived token: ${errorText}`, { status: 500 });
    }

    const longLivedData = await longLivedResponse.json();
    const longLivedToken = longLivedData.access_token;

    // Redirect back to the app with a success status
    const appPreviewUrl = "https://3000-i28ladg46z76xt0dj8qdg-ac85d35c.blink.new"; // Hardcoded for now
    const appRedirectUrl = new URL(`${appPreviewUrl}/social`);
    appRedirectUrl.searchParams.set("instagram_auth_status", "success");
    appRedirectUrl.searchParams.set("platform_id", "instagram");

    return Response.redirect(appRedirectUrl.toString(), 302);
  } catch (error) {
    const appPreviewUrl = "https://3000-i28ladg46z76xt0dj8qdg-ac85d35c.blink.new"; // Hardcoded for now
    const appRedirectUrl = new URL(`${appPreviewUrl}/social`);
    appRedirectUrl.searchParams.set("instagram_auth_status", "error");
    appRedirectUrl.searchParams.set("error_message", error.message);
    return Response.redirect(appRedirectUrl.toString(), 302);
  }
});