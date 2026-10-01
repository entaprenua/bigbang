import { A } from "@solidjs/router"
import { Grid } from "~/components/ui/grid"
import { Flex } from "~/components/ui/flex"
import { SettingsProvider } from "~/components/ui/settings"
import { SocialEntry, SocialEntryLink } from "~/components/ui/social"
import { StoreName } from "~/components/store"

export function Footer() {
  return (
    <SettingsProvider fields={["social"]}>
      <footer class="border-t border-border bg-background py-16 text-muted-foreground">
        <div class="container mx-auto px-4">
          <Grid cols={4} class="gap-10">
            <div>
              <h3 class="mb-6 font-serif text-lg text-foreground">
                <StoreName />
              </h3>
            </div>
            <div>
              <h3 class="mb-6 font-serif text-lg text-foreground">Help</h3>
              <Flex class="flex-col gap-3">
                <A href="/contact" class="text-sm transition-colors hover:text-foreground">Contact Us</A>
                <A href="/about" class="text-sm transition-colors hover:text-foreground">About Us</A>
              </Flex>
            </div>
            <div>
              <h3 class="mb-6 font-serif text-lg text-foreground">Legal</h3>
              {/*<Flex class="flex-col gap-3">
                <A href="/privacy" class="text-sm transition-colors hover:text-foreground">Privacy Policy</A>
                <A href="/terms" class="text-sm transition-colors hover:text-foreground">Terms of Service</A>
              </Flex>
             */}
            </div>
            <div>
              <h3 class="mb-6 font-serif text-lg text-foreground">Connect</h3>
              <Flex class="flex-col gap-3">
                <SocialEntry name="facebook">
                  <SocialEntryLink class="text-sm transition-colors hover:text-foreground">Facebook</SocialEntryLink>
                </SocialEntry>
                <SocialEntry name="instagram">
                  <SocialEntryLink class="text-sm transition-colors hover:text-foreground">Instagram</SocialEntryLink>
                </SocialEntry>
                <SocialEntry name="twitter">
                  <SocialEntryLink class="text-sm transition-colors hover:text-foreground">Twitter</SocialEntryLink>
                </SocialEntry>
                <SocialEntry name="youtube">
                  <SocialEntryLink class="text-sm transition-colors hover:text-foreground">YouTube</SocialEntryLink>
                </SocialEntry>
              </Flex>
            </div>
          </Grid>
        </div>
      </footer>
    </SettingsProvider>
  )
}
