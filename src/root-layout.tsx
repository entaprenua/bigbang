import { Suspense, type JSX } from "solid-js"
import { Footer } from "~/components/footer"
import { Header } from "~/components/header"
import { OGMeta } from "~/components/og"
import { StoreName, StoreDescription } from "~/components/ui/store"

export default function RootLayout(props: { children?: JSX.Element }) {
  return (
    <>
      <OGMeta />
      <Suspense fallback={
        <div class="flex min-h-[50vh] items-center justify-center">
          <div class="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      }>
        <Header />
        {props.children}
        <Footer />
      </Suspense>
    </>
  )
}

