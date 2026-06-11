import { clientOnly } from "@solidjs/start"
import { Suspense } from "solid-js";
import { isServer } from "solid-js/web"
import { ColorModeProvider, ColorModeScript, cookieStorageManagerSSR } from "@kobalte/core"
import { getCookie } from "vinxi/http"

export default clientOnly(async () => ({ default: Home }), { lazy: true })

function getServerCookies() {
  "use server"
  const colorMode = getCookie("kb-color-mode")
  return colorMode ? `kb-color-mode=${colorMode}` : ""
}


function Home(props) {
  const storageManager = cookieStorageManagerSSR(isServer ? getServerCookies() : document.cookie)


  return (
    <div class="h-full overflow-clip bg-background">
      <ColorModeScript
        storageType={storageManager.type}
      />
      <ColorModeProvider
        storageManager={storageManager}
      >
        <div class="h-[100vh] overflow-auto bg-gradient-to-b from-background to-secondary/10">
          <Suspense fallback={
            <div class="flex items-center justify-center h-[calc(100vh-5rem)]">
              <div class="animate-pulse text-muted-foreground">Loading...</div>
            </div>
          }>
            {props.children}
          </Suspense>
        </div>
      </ColorModeProvider>
    </div>
  )
}

