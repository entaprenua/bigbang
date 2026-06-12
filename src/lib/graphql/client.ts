"use server";

import { GraphQLClient } from "graphql-request"
import { getApiPrefix, getProxyBaseUrl, getStoreApiKey } from "~/lib/api/http"

export async function executeGQL<T = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const baseUrl = getProxyBaseUrl()
  const prefix = getApiPrefix()
  const apiKey = getStoreApiKey()

  const client = new GraphQLClient(`${baseUrl}${prefix}/graphql`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { "X-Store-API-Key": apiKey } : {}),
    },
  })

  return client.request<T>(query, variables)
}
