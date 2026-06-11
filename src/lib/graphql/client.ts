import { GraphQLClient } from "graphql-request"
import { getApiBaseUrl, getApiPrefix, getApiKey } from "~/lib/api/http"

const baseUrl = getApiBaseUrl() || (typeof window !== "undefined" ? window.location.origin : "")

export const gqlClient = new GraphQLClient(`${baseUrl}${getApiPrefix()}/graphql`, {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  requestMiddleware: (request) => {
    const apiKey = getApiKey()
    if (apiKey) {
      const headers = new Headers(request.headers)
      headers.set("X-Store-API-Key", apiKey)
      request.headers = headers
    }
    return request
  },
})
