import { createEffect } from "solid-js"
import { useNavigate } from "@solidjs/router"
import { useAuth, AuthLogout } from "~/components/ui/auth"
import {
  CustomerName,
  CustomerEmail,
  CustomerPhone,
  CustomerAvatar,
  CustomerAvatarImage,
  CustomerAvatarFallback,
} from "~/components/ui/customer"
import { QueryLoading, QueryError, QuerySuccess, MutationButton } from "~/components/ui/query"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

export default function AccountPage() {
  const auth = useAuth()
  const navigate = useNavigate()

  createEffect(() => {
    if (!auth.isLoading() && !auth.isAuthenticated()) navigate("/auth/login", { replace: true })
  })

  return (
    <div class="min-h-screen bg-background">
      <div class="container mx-auto max-w-2xl px-4 py-12">
        <h1 class="mb-8 text-3xl font-semibold">My Account</h1>

        <div class="flex flex-col gap-6">
          <QueryLoading>
            <div class="space-y-4">
              <div class="h-16 animate-pulse rounded-xl bg-muted" />
              <div class="h-32 animate-pulse rounded-xl bg-muted" />
            </div>
          </QueryLoading>

          <QueryError class="text-sm">
            Something went wrong loading your account.
          </QueryError>

          <QuerySuccess>
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent class="flex flex-col gap-4">
                <div class="flex items-center gap-4">
                  <CustomerAvatar>
                    <CustomerAvatarImage class="h-14 w-14 rounded-full object-cover" />
                    <CustomerAvatarFallback>
                      <span class="text-lg font-medium" />
                    </CustomerAvatarFallback>
                  </CustomerAvatar>
                  <div class="flex flex-col gap-0.5">
                    <span class="text-lg font-medium"><CustomerName /></span>
                    <span class="text-sm text-muted-foreground"><CustomerEmail /></span>
                  </div>
                </div>

                <dl class="flex flex-col gap-3 border-t border-border pt-4 text-sm">
                  <div class="flex items-center justify-between gap-4">
                    <dt class="text-muted-foreground">Name</dt>
                    <dd class="font-medium"><CustomerName /></dd>
                  </div>
                  <div class="flex items-center justify-between gap-4">
                    <dt class="text-muted-foreground">Email</dt>
                    <dd class="font-medium"><CustomerEmail /></dd>
                  </div>
                  <div class="flex items-center justify-between gap-4">
                    <dt class="text-muted-foreground">Phone</dt>
                    <dd class="font-medium"><CustomerPhone /></dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </QuerySuccess>

          <AuthLogout onSuccess={() => navigate("/", { replace: true })}>
            <MutationButton variant="outline" class="w-full">
              Sign out
            </MutationButton>
          </AuthLogout>
        </div>
      </div>
    </div>
  )
}
