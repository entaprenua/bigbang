import { SettingsProvider } from "~/components/ui/settings"
import {
  AboutEntry, AboutEntryLabel, AboutEntryValue,
  AboutValuesEntry, AboutValuesEntryLabel, AboutValuesEntryValue,
} from "~/components/ui/about"
import { Card } from "~/components/ui/card"
import { Callout, CalloutTitle, CalloutContent } from "~/components/ui/callout"

const VALUE_ICONS: Record<string, string> = {
  Quality: "⭐",
  Sustainability: "🌿",
  Community: "❤️",
  Innovation: "⚡",
}

export default function AboutPage() {
  return (
    <SettingsProvider fields={["about"]}>
      <div class="min-h-screen bg-background">
        <div class="container mx-auto max-w-4xl px-4 py-12">
          <h1 class="mb-12 text-center text-4xl font-serif font-light">About Us</h1>

          <section class="mb-12">
            <Callout variant="default">
              <CalloutTitle>Our Story</CalloutTitle>
              <CalloutContent>
                <AboutEntry name="story" defaultValue="Our story is being written...">
                  <p class="text-lg leading-relaxed text-muted-foreground"><AboutEntryValue /></p>
                </AboutEntry>
              </CalloutContent>
            </Callout>
          </section>

          <div class="mb-12 grid gap-8 md:grid-cols-2">
            <section>
              <Card class="h-full p-8">
                <AboutEntry name="mission">
                  <h3 class="mb-3 text-xl font-serif font-semibold"><AboutEntryLabel /></h3>
                  <p class="leading-relaxed text-muted-foreground"><AboutEntryValue /></p>
                </AboutEntry>
              </Card>
            </section>
            <section>
              <Card class="h-full p-8">
                <AboutEntry name="vision">
                  <h3 class="mb-3 text-xl font-serif font-semibold"><AboutEntryLabel /></h3>
                  <p class="leading-relaxed text-muted-foreground"><AboutEntryValue /></p>
                </AboutEntry>
              </Card>
            </section>
          </div>

          <section class="mb-12">
            <Callout variant="success">
              <CalloutTitle>Why Choose Us</CalloutTitle>
              <CalloutContent>
                <AboutEntry name="whyUs" defaultValue="What sets us apart...">
                  <p class="text-lg leading-relaxed text-muted-foreground"><AboutEntryValue /></p>
                </AboutEntry>
              </CalloutContent>
            </Callout>
          </section>

          <section>
            <h2 class="mb-10 text-center text-2xl font-serif font-semibold">Our Values</h2>
            <div class="grid gap-6 md:grid-cols-4">
              <AboutValuesEntry name="Quality">
                <Card class="h-full p-6 text-center">
                  <div class="mb-3 text-3xl">{VALUE_ICONS.Quality}</div>
                  <span class="mb-2 block font-semibold"><AboutValuesEntryLabel /></span>
                  <p class="text-sm leading-relaxed text-muted-foreground"><AboutValuesEntryValue /></p>
                </Card>
              </AboutValuesEntry>
              <AboutValuesEntry name="Sustainability">
                <Card class="h-full p-6 text-center">
                  <div class="mb-3 text-3xl">{VALUE_ICONS.Sustainability}</div>
                  <span class="mb-2 block font-semibold"><AboutValuesEntryLabel /></span>
                  <p class="text-sm leading-relaxed text-muted-foreground"><AboutValuesEntryValue /></p>
                </Card>
              </AboutValuesEntry>
              <AboutValuesEntry name="Community">
                <Card class="h-full p-6 text-center">
                  <div class="mb-3 text-3xl">{VALUE_ICONS.Community}</div>
                  <span class="mb-2 block font-semibold"><AboutValuesEntryLabel /></span>
                  <p class="text-sm leading-relaxed text-muted-foreground"><AboutValuesEntryValue /></p>
                </Card>
              </AboutValuesEntry>
              <AboutValuesEntry name="Innovation">
                <Card class="h-full p-6 text-center">
                  <div class="mb-3 text-3xl">{VALUE_ICONS.Innovation}</div>
                  <span class="mb-2 block font-semibold"><AboutValuesEntryLabel /></span>
                  <p class="text-sm leading-relaxed text-muted-foreground"><AboutValuesEntryValue /></p>
                </Card>
              </AboutValuesEntry>
            </div>
          </section>
        </div>
      </div>
    </SettingsProvider>
  )
}
