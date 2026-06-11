export function getApiPrefix(): string {
  return import.meta.env.VITE_API_PREFIX || "/api/v1"
}

export function localBaseUrl(): string {
  if (typeof window !== "undefined") return window.location.origin
  const host = process.env.HOST || "localhost"
  const port = process.env.NITRO_PORT || process.env.PORT || "3000"
  return `http://${host}:${port}`
}
