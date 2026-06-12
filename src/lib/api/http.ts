export function getApiPrefix(): string {
  return import.meta.env.VITE_API_PREFIX || "/api/v1"
}

export function getProxyBaseUrl(): string {
  return process.env.PROXY_API_BASE_URL || "https://entaprenua.com"
}

export function getStoreApiKey(): string {
  return process.env.STORE_API_KEY || ""
}

