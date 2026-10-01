import { createEffect } from "solid-js"
import { useNavigate, A } from "@solidjs/router"
import { useAuth } from "~/components/ui/auth"
import { SignupForm } from "~/components/auth"
import { Card, CardContent } from "~/components/ui/card"
import { StoreName } from "~/components/ui/store"

export default function SignupPage() {
  const auth = useAuth()
  const navigate = useNavigate()

  createEffect(() => {
    if (auth.isAuthenticated()) navigate("/", { replace: true })
  })

  return (
    <div class="min-h-screen bg-background">
      <div class="container mx-auto flex justify-center px-4 py-12">
        <Card class="w-full max-w-md p-8">
          <CardContent class="flex flex-col gap-6">
            <div class="flex flex-col items-center gap-2 text-center">
              <StoreName />
              <h1 class="text-2xl font-semibold">Create your account</h1>
              <p class="text-sm text-muted-foreground">
                Track orders, save favourites, faster checkout
              </p>
            </div>

            <SignupForm />

            <p class="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <A href="/auth/login" class="font-medium text-foreground underline-offset-4 hover:underline">
                Sign in
              </A>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
