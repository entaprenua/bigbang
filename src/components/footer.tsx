import { A } from "@solidjs/router"
import { Grid } from "~/components/ui/grid"
import { Flex } from "~/components/ui/flex"
import { SettingsProvider } from "~/components/ui/settings"
import { SocialEntry, SocialEntryLink } from "~/components/ui/social"
import { StoreName } from "~/components/store"

export function Footer() {
  return (
    <SettingsProvider fields={["social"]}>
      <footer class="bg-stone-900 text-stone-400 py-16">
        <div class="container mx-auto px-4">
          <Grid cols={4} class="gap-10">
            <div>
              <h3 class="text-white font-serif text-lg mb-6">
                <StoreName />
              </h3>
              <p class="text-sm leading-relaxed">
                Your destination for curated products.
              </p>
            </div>
            <div>
              <h3 class="text-white font-serif text-lg mb-6">Help</h3>
              <Flex class="flex-col gap-3">
                <A href="/contact" class="text-sm hover:text-white transition-colors">Contact Us</A>
                <A href="/about" class="text-sm hover:text-white transition-colors">About Us</A>
              </Flex>
            </div>
            <div>
              <h3 class="text-white font-serif text-lg mb-6">Legal</h3>
              {/*<Flex class="flex-col gap-3">
                <A href="/privacy" class="text-sm hover:text-white transition-colors">Privacy Policy</A>
                <A href="/terms" class="text-sm hover:text-white transition-colors">Terms of Service</A>
              </Flex>
             */}
            </div>
            <div>
              <h3 class="text-white font-serif text-lg mb-6">Connect</h3>
              <Flex class="flex-col gap-3">
                <SocialEntry name="facebook">
                  <SocialEntryLink class="text-sm hover:text-white transition-colors">Facebook</SocialEntryLink>
                </SocialEntry>
                <SocialEntry name="instagram">
                  <SocialEntryLink class="text-sm hover:text-white transition-colors">Instagram</SocialEntryLink>
                </SocialEntry>
                <SocialEntry name="twitter">
                  <SocialEntryLink class="text-sm hover:text-white transition-colors">Twitter</SocialEntryLink>
                </SocialEntry>
                <SocialEntry name="youtube">
                  <SocialEntryLink class="text-sm hover:text-white transition-colors">YouTube</SocialEntryLink>
                </SocialEntry>
              </Flex>
            </div>
          </Grid>
        </div>
      </footer>
    </SettingsProvider>
  )
}
