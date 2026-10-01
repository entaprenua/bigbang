import { useQueryClient, QueryClient as TanStackQueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { splitProps } from "solid-js";

const QueryClient = (props) => {
  const [local, others] = splitProps(props, ["children"])
  const queryClient = new TanStackQueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      {local.children}
    </QueryClientProvider>
  )
}

export { QueryClient, useQueryClient }
