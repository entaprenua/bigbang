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
      <div class="bg-stone-50 min-h-screen">
        <div class="container mx-auto px-4 py-12 max-w-4xl">
          <h1 class="text-4xl font-serif font-light mb-12 text-center">About Us</h1>

          <section class="mb-12">
            <Callout variant="warning">
              <CalloutTitle>Our Story</CalloutTitle>
              <CalloutContent>
                <AboutEntry name="story" defaultValue="Our story is being written...">
                  <p class="text-stone-600 leading-relaxed text-lg"><AboutEntryValue /></p>
                </AboutEntry>
              </CalloutContent>
            </Callout>
          </section>

          <div class="grid md:grid-cols-2 gap-8 mb-12">
            <section>
              <Card class="p-8 h-full">
                <AboutEntry name="mission">
                  <h3 class="text-xl font-serif font-semibold mb-3"><AboutEntryLabel /></h3>
                  <p class="text-stone-600 leading-relaxed"><AboutEntryValue /></p>
                </AboutEntry>
              </Card>
            </section>
            <section>
              <Card class="p-8 h-full">
                <AboutEntry name="vision">
                  <h3 class="text-xl font-serif font-semibold mb-3"><AboutEntryLabel /></h3>
                  <p class="text-stone-600 leading-relaxed"><AboutEntryValue /></p>
                </AboutEntry>
              </Card>
            </section>
          </div>

          <section class="mb-12">
            <Callout variant="warning">
              <CalloutTitle>Why Choose Us</CalloutTitle>
              <CalloutContent>
                <AboutEntry name="whyUs" defaultValue="What sets us apart...">
                  <p class="text-stone-600 leading-relaxed text-lg"><AboutEntryValue /></p>
                </AboutEntry>
              </CalloutContent>
            </Callout>
          </section>

          <section>
            <h2 class="text-2xl font-serif font-semibold mb-10 text-center">Our Values</h2>
            <div class="grid md:grid-cols-4 gap-6">
              <AboutValuesEntry name="Quality">
                <Card class="p-6 text-center h-full">
                  <div class="text-3xl mb-3">{VALUE_ICONS.Quality}</div>
                  <span class="font-semibold block mb-2"><AboutValuesEntryLabel /></span>
                  <p class="text-sm text-stone-500 leading-relaxed"><AboutValuesEntryValue /></p>
                </Card>
              </AboutValuesEntry>
              <AboutValuesEntry name="Sustainability">
                <Card class="p-6 text-center h-full">
                  <div class="text-3xl mb-3">{VALUE_ICONS.Sustainability}</div>
                  <span class="font-semibold block mb-2"><AboutValuesEntryLabel /></span>
                  <p class="text-sm text-stone-500 leading-relaxed"><AboutValuesEntryValue /></p>
                </Card>
              </AboutValuesEntry>
              <AboutValuesEntry name="Community">
                <Card class="p-6 text-center h-full">
                  <div class="text-3xl mb-3">{VALUE_ICONS.Community}</div>
                  <span class="font-semibold block mb-2"><AboutValuesEntryLabel /></span>
                  <p class="text-sm text-stone-500 leading-relaxed"><AboutValuesEntryValue /></p>
                </Card>
              </AboutValuesEntry>
              <AboutValuesEntry name="Innovation">
                <Card class="p-6 text-center h-full">
                  <div class="text-3xl mb-3">{VALUE_ICONS.Innovation}</div>
                  <span class="font-semibold block mb-2"><AboutValuesEntryLabel /></span>
                  <p class="text-sm text-stone-500 leading-relaxed"><AboutValuesEntryValue /></p>
                </Card>
              </AboutValuesEntry>
            </div>
          </section>
        </div>
      </div>
    </SettingsProvider>
  )
}
