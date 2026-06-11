import { GraphQLClient } from "graphql-request"
import { getApiPrefix, localBaseUrl } from "~/lib/api/http"

const baseUrl = localBaseUrl()
export const gqlClient = new GraphQLClient(`${baseUrl}${getApiPrefix()}/graphql`, {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
})
