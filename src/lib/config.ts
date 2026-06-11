"use server";

export async function getConfig(): Promise<Record<string, boolean | string | number>> {
  const mpesaReady = !!(process.env.MPESA_CONSUMER_KEY && process.env.MPESA_CONSUMER_SECRET)
  return {
    mpesa_enabled: process.env.MPESA_ENABLED === "true" || (process.env.MPESA_ENABLED !== "false" && mpesaReady),
    stripe_enabled: process.env.STRIPE_ENABLED === "true" || (process.env.STRIPE_ENABLED !== "false" && !!process.env.STRIPE_SECRET_KEY),
    google_maps_enabled:
      process.env.GOOGLE_MAPS_ENABLED === "true" ||
      (process.env.GOOGLE_MAPS_ENABLED !== "false" &&
        !!process.env.GOOGLE_MAPS_API_KEY),
    google_maps_api_key: process.env.GOOGLE_MAPS_API_KEY ?? "",
    google_maps_latitude: parseFloat(process.env.GOOGLE_MAPS_LATITUDE ?? ""),
    google_maps_longitude: parseFloat(process.env.GOOGLE_MAPS_LONGITUDE ?? ""),
    google_auth_enabled:
      process.env.GOOGLE_AUTH_ENABLED === "true" ||
      (process.env.GOOGLE_AUTH_ENABLED !== "false" &&
        !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)),
    facebook_auth_enabled:
      process.env.FACEBOOK_AUTH_ENABLED === "true" ||
      (process.env.FACEBOOK_AUTH_ENABLED !== "false" &&
        !!(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET)),
  }
}
