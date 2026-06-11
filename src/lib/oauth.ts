"use server";

import { registerCustomer } from "~/lib/api/auth"

export type OAuthProvider = "google" | "facebook"

export interface StartOAuthResult {
  url: string
  state: string
}

export interface ExchangeOAuthResult {
  success: boolean
  customer?: {
    id: string
    email: string
    name?: string | null
    phone?: string | null
    avatarUrl?: string | null
  } | null
  error?: string
}

export interface ExchangeOAuthResult {
  success: boolean;
  customer?: {
    id: string;
    email: string;
    name?: string | null;
    phone?: string | null;
    avatarUrl?: string | null;
  } | null;
  error?: string;
}

export async function startOAuth(
  provider: OAuthProvider,
  origin: string,
): Promise<StartOAuthResult> {
  if (provider === "google") {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) throw new Error("GOOGLE_CLIENT_ID not configured");

    const state = crypto.randomUUID();
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${origin}/oauth/callback`,
      response_type: "code",
      scope: "openid email profile",
      state,
      access_type: "online",
    });
    return { url: `https://accounts.google.com/o/oauth2/v2/auth?${params}`, state };
  }

  if (provider === "facebook") {
    const clientId = process.env.FACEBOOK_CLIENT_ID;
    if (!clientId) throw new Error("FACEBOOK_CLIENT_ID not configured");

    const state = crypto.randomUUID();
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${origin}/oauth/callback`,
      scope: "email,public_profile",
      state,
    });
    return { url: `https://www.facebook.com/v18.0/dialog/oauth?${params}`, state };
  }

  throw new Error(`Unknown provider: ${provider}`);
}

export async function exchangeOAuth(
  provider: string,
  code: string,
  state: string,
  origin: string,
): Promise<ExchangeOAuthResult> {
  if (provider === "google") {
    return exchangeGoogle(code, origin);
  }
  if (provider === "facebook") {
    return exchangeFacebook(code, origin);
  }
  return { success: false, error: `Unknown provider: ${provider}` };
}

async function exchangeGoogle(
  code: string,
  origin: string,
): Promise<ExchangeOAuthResult> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return { success: false, error: "Google OAuth not configured" };
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${origin}/oauth/callback`,
      grant_type: "authorization_code",
    }),
  });
  const tokenJson = await tokenRes.json() as {
    access_token?: string;
    error?: string;
  };
  if (!tokenJson.access_token) {
    return { success: false, error: tokenJson.error || "Failed to exchange token" };
  }

  const profileRes = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    { headers: { Authorization: `Bearer ${tokenJson.access_token}` } },
  );
  const profile = await profileRes.json() as {
    id?: string;
    email?: string;
    name?: string;
    picture?: string;
  };

  if (!profile.email) {
    return { success: false, error: "Failed to get user profile" };
  }

  const result = await registerCustomer({
      email: profile.email,
      name: profile.name || null,
      avatarUrl: profile.picture || null,
      identityProvider: "GOOGLE",
      emailVerified: true,
      oauthProviderId: profile.id || null,
    })

  if (!result.success || !result.customer) {
    return { success: false, error: "Failed to register customer" }
  }

  return { success: true, customer: result.customer }
}

async function exchangeFacebook(
  code: string,
  origin: string,
): Promise<ExchangeOAuthResult> {
  const clientId = process.env.FACEBOOK_CLIENT_ID;
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return { success: false, error: "Facebook OAuth not configured" };
  }

  const params = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: `${origin}/oauth/callback`,
  });
  const tokenRes = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?${params}`,
  );
  const tokenJson = await tokenRes.json() as {
    access_token?: string;
    error?: { message: string };
  };
  if (!tokenJson.access_token) {
    return {
      success: false,
      error: tokenJson.error?.message || "Failed to exchange token",
    };
  }

  const profileRes = await fetch(
    `https://graph.facebook.com/me?fields=id,email,name,picture&access_token=${tokenJson.access_token}`,
  );
  const profile = await profileRes.json() as {
    id?: string;
    email?: string;
    name?: string;
    picture?: { data: { url: string } };
  };

  if (!profile.email) {
    return { success: false, error: "Failed to get user profile" };
  }

  const result = await registerCustomer({
      email: profile.email,
      name: profile.name || null,
      avatarUrl: profile.picture?.data?.url || null,
      identityProvider: "FACEBOOK",
      emailVerified: true,
      oauthProviderId: profile.id || null,
    })

  if (!result.success || !result.customer) {
    return { success: false, error: "Failed to register customer" }
  }

  return { success: true, customer: result.customer }
}
