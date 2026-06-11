import { SettingsProvider } from "~/components/ui/settings"
import {
  ContactEntry, ContactEntryLabel, ContactEntryValue,
  ContactWorkingHoursEntry, ContactWorkingHoursEntryLabel, ContactWorkingHoursEntryValue,
} from "~/components/ui/contact"
import {
  SocialEntry, SocialEntryLink,
} from "~/components/ui/social"
import { Card } from "~/components/ui/card"
import { GoogleMap, GoogleMapMarker, GoogleMapInfoWindow } from "~/components/ui/google-map"
import { StoreName } from "~/components/ui/store"

const CONTACT_ICONS: Record<string, string> = {
  email: "✉",
  phone: "📞",
  address: "📍",
}

export default function ContactPage() {
  return (
    <SettingsProvider fields={["contact", "social"]}>
      <div class="bg-stone-50 min-h-screen">
        <div class="container mx-auto px-4 py-12 max-w-4xl">
          <h1 class="text-4xl font-serif font-light mb-12 text-center">Contact Us</h1>

          <div class="grid md:grid-cols-2 gap-8">
            <section class="space-y-6">
              <Card class="p-8">
                <h2 class="text-xl font-serif font-semibold mb-6">Get in Touch</h2>
                <div class="space-y-4">
                  <ContactEntry name="email">
                    <div class="flex items-start gap-3">
                      <span class="text-xl mt-0.5">{CONTACT_ICONS.email}</span>
                      <div>
                        <span class="block text-sm font-medium text-stone-500"><ContactEntryLabel /></span>
                        <p class="text-stone-800 mt-0.5"><ContactEntryValue /></p>
                      </div>
                    </div>
                  </ContactEntry>
                  <ContactEntry name="phone" defaultValue="Coming soon">
                    <div class="flex items-start gap-3">
                      <span class="text-xl mt-0.5">{CONTACT_ICONS.phone}</span>
                      <div>
                        <span class="block text-sm font-medium text-stone-500"><ContactEntryLabel /></span>
                        <p class="text-stone-800 mt-0.5"><ContactEntryValue /></p>
                      </div>
                    </div>
                  </ContactEntry>
                  <ContactEntry name="address">
                    <div class="flex items-start gap-3">
                      <span class="text-xl mt-0.5">{CONTACT_ICONS.address}</span>
                      <div>
                        <span class="block text-sm font-medium text-stone-500"><ContactEntryLabel /></span>
                        <p class="text-stone-800 mt-0.5"><ContactEntryValue /></p>
                      </div>
                    </div>
                  </ContactEntry>
                </div>
              </Card>

              <Card class="p-8">
                <h2 class="text-xl font-serif font-semibold mb-4">Follow Us</h2>
                <div class="flex flex-wrap gap-3">
                  <SocialEntry name="facebook">
                    <SocialEntryLink class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm transition-colors">
                      Facebook
                    </SocialEntryLink>
                  </SocialEntry>
                  <SocialEntry name="instagram">
                    <SocialEntryLink class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm transition-colors">
                      Instagram
                    </SocialEntryLink>
                  </SocialEntry>
                  <SocialEntry name="twitter">
                    <SocialEntryLink class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm transition-colors">
                      Twitter
                    </SocialEntryLink>
                  </SocialEntry>
                  <SocialEntry name="youtube">
                    <SocialEntryLink class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm transition-colors">
                      YouTube
                    </SocialEntryLink>
                  </SocialEntry>
                  <SocialEntry name="linkedin">
                    <SocialEntryLink class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm transition-colors">
                      LinkedIn
                    </SocialEntryLink>
                  </SocialEntry>
                  <SocialEntry name="tiktok">
                    <SocialEntryLink class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm transition-colors">
                      TikTok
                    </SocialEntryLink>
                  </SocialEntry>
                </div>
              </Card>
            </section>

            <section>
              <Card class="p-8">
                <h2 class="text-xl font-serif font-semibold mb-6">Working Hours</h2>
                <div class="space-y-3">
                  <ContactWorkingHoursEntry name="Monday">
                    <div class="flex justify-between pb-3 border-b border-stone-100">
                      <span class="text-stone-600"><ContactWorkingHoursEntryLabel /></span>
                      <span class="text-stone-800 font-medium"><ContactWorkingHoursEntryValue /></span>
                    </div>
                  </ContactWorkingHoursEntry>
                  <ContactWorkingHoursEntry name="Tuesday">
                    <div class="flex justify-between pb-3 border-b border-stone-100">
                      <span class="text-stone-600"><ContactWorkingHoursEntryLabel /></span>
                      <span class="text-stone-800 font-medium"><ContactWorkingHoursEntryValue /></span>
                    </div>
                  </ContactWorkingHoursEntry>
                  <ContactWorkingHoursEntry name="Wednesday">
                    <div class="flex justify-between pb-3 border-b border-stone-100">
                      <span class="text-stone-600"><ContactWorkingHoursEntryLabel /></span>
                      <span class="text-stone-800 font-medium"><ContactWorkingHoursEntryValue /></span>
                    </div>
                  </ContactWorkingHoursEntry>
                  <ContactWorkingHoursEntry name="Thursday">
                    <div class="flex justify-between pb-3 border-b border-stone-100">
                      <span class="text-stone-600"><ContactWorkingHoursEntryLabel /></span>
                      <span class="text-stone-800 font-medium"><ContactWorkingHoursEntryValue /></span>
                    </div>
                  </ContactWorkingHoursEntry>
                  <ContactWorkingHoursEntry name="Friday">
                    <div class="flex justify-between pb-3 border-b border-stone-100">
                      <span class="text-stone-600"><ContactWorkingHoursEntryLabel /></span>
                      <span class="text-stone-800 font-medium"><ContactWorkingHoursEntryValue /></span>
                    </div>
                  </ContactWorkingHoursEntry>
                  <ContactWorkingHoursEntry name="Saturday" defaultValue="Closed">
                    <div class="flex justify-between pb-3 border-b border-stone-100">
                      <span class="text-stone-600"><ContactWorkingHoursEntryLabel /></span>
                      <span class="text-stone-800 font-medium"><ContactWorkingHoursEntryValue /></span>
                    </div>
                  </ContactWorkingHoursEntry>
                  <ContactWorkingHoursEntry name="Sunday" defaultValue="Closed">
                    <div class="flex justify-between">
                      <span class="text-stone-600"><ContactWorkingHoursEntryLabel /></span>
                      <span class="text-stone-800 font-medium"><ContactWorkingHoursEntryValue /></span>
                    </div>
                  </ContactWorkingHoursEntry>
                </div>
              </Card>
            </section>
          </div>

          <section class="mt-8">
            <GoogleMap class="w-full h-[400px] rounded-lg shadow-sm">
              <GoogleMapMarker />
              <GoogleMapInfoWindow>
                <div class="text-sm p-1">
                  <p class="font-semibold"><StoreName /></p>
                  <p class="text-stone-500">123 Riverside Drive, Nairobi</p>
                </div>
              </GoogleMapInfoWindow>
            </GoogleMap>
          </section>
        </div>
      </div>
    </SettingsProvider>
  )
}
