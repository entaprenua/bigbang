import type { APIEvent } from "@solidjs/start/server"

const PROXY_BASE = process.env.PROXY_API_BASE_URL || "https://entaprenua.com"
const API_PREFIX = process.env.VITE_API_PREFIX || "/api/v1"
const STORE_API_KEY = process.env.STORE_API_KEY || ""

async function proxy(event: APIEvent) {
  const { request, params } = event
  const path = params.path
  const searchParams = new URL(request.url).search
  const target = `${PROXY_BASE}${API_PREFIX}/${path}${searchParams}`

  const headers: Record<string, string> = {}

  const contentType = request.headers.get("content-type")
  if (contentType) headers["Content-Type"] = contentType

  if (STORE_API_KEY) headers["X-Store-API-Key"] = STORE_API_KEY

  const csrf = request.headers.get("x-csrf-token")
  if (csrf) headers["X-CSRF-Token"] = csrf

  const cookie = request.headers.get("cookie")
  if (cookie) headers["Cookie"] = cookie

  const body = request.method !== "GET" && request.method !== "HEAD"
    ? await request.text()
    : undefined

  const upstream = await fetch(target, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  })

  const responseHeaders = new Headers()
  upstream.headers.forEach((value, key) => {
    const lower = key.toLowerCase()
    if (lower !== "transfer-encoding" && lower !== "content-encoding" && lower !== "content-length") {
      responseHeaders.set(key, value)
    }
  })

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  })
}

export const GET = proxy
export const POST = proxy
export const PUT = proxy
export const DELETE = proxy
export const PATCH = proxy
