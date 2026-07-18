import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { MetaProvider } from "@solidjs/meta";
import { QueryClient, useQueryClient } from "~/components/ui/query-client"
import { AuthProvider } from "~/components/ui/auth/auth-provider";
import { StoreProvider } from "~/components/ui/store";
import RootLayout from "./root-layout"
import { Flex } from "~/components/ui/flex"
import { Text } from "~/components/ui/text"
import AlertTriangleIcon from "lucide-solid/icons/alert-triangle"
import { ErrorBoundary, ErrorBoundaryMessage, ErrorBoundaryResetButton } from "~/components/ui/error-boundary"
import { ColorMode } from "~/components/ui/color-mode"
import { CartProvider } from "~/components/ui/cart"
import "./app.css";


export default function App() {

  return (
    <MetaProvider>
      <ColorMode>
        <ErrorBoundary
          fallback={
            <Flex class="min-h-screen w-full flex-col items-center justify-center gap-6 bg-background p-8">
              <div class="rounded-full bg-destructive/10 p-6">
                <AlertTriangleIcon class="h-12 w-12 text-destructive" />
              </div>
              <Flex class="flex-col items-center gap-2 text-center">
                <Text variant="h2" class="font-bold">Something went wrong</Text>
                <Text variant="body1" class="text-muted-foreground max-w-md">
                  <ErrorBoundaryMessage />
                </Text>
              </Flex>
              <ErrorBoundaryResetButton class="px-8">
                Try Again
              </ErrorBoundaryResetButton>
            </Flex>
          }
        >
          <StoreProvider>
            <AuthProvider>
              <QueryClient>
                <CartProvider>
                  <Router
                    root={RootLayout}
                  >
                    <FileRoutes />
                  </Router>
                </CartProvider>
              </QueryClient>
            </AuthProvider>
          </StoreProvider>
        </ErrorBoundary>
      </ColorMode>
    </MetaProvider>
  );
}
