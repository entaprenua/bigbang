import { gqlClient } from "~/lib/graphql/client"

export type SettingsField = "contact" | "delivery" | "social"
  | "about" | "email" | "currencies"

export type WorkingHoursData = {
  dayOfWeek?: string
  opens?: string
  closes?: string
  closed?: boolean
}

export type CoreValueData = {
  label?: string
  icon?: string
  description?: string
}

export type ContactSettingsData = {
  email?: string
  phone?: string
  address?: string
  latitude?: number
  longitude?: number
  workingHours?: WorkingHoursData[]
  customFields?: string
}

export type SocialLinksData = {
  twitter?: string
  facebook?: string
  instagram?: string
  tiktok?: string
  linkedin?: string
  youtube?: string
  customFields?: string
}

export type AboutSettingsData = {
  story?: string
  mission?: string
  vision?: string
  values?: CoreValueData[]
  whyUs?: string
  customFields?: string
}

export type EmailSettingsData = {
  enabled?: boolean
  otpTemplate?: string
  senderName?: string
  senderEmail?: string
  tokenExpiryHours?: number
  domain?: string
  customFields?: string
}

export type ExchangeRateData = {
  currency?: string
  rate?: number
  symbol?: string
}

export type CurrencySettingsData = {
  rates?: ExchangeRateData[]
  customFields?: string
}

export type DeliverySettingsData = {
  shippingClasses: { id: string; name: string; description?: string }[]
}

export type ParsedStoreSettings = {
  contact?: ContactSettingsData | null
  social?: SocialLinksData | null
  about?: AboutSettingsData | null
  email?: EmailSettingsData | null
  currencies?: CurrencySettingsData | null
  delivery?: DeliverySettingsData | null
}

const JSON_FIELDS = new Set<SettingsField>(["contact", "social", "about", "email", "currencies"])

const FIELD_QUERIES: Record<SettingsField, string> = {
  contact: `contact`,
  delivery: `delivery { shippingClasses { id name description } }`,
  social: `social`,
  about: `about`,
  email: `email`,
  currencies: `currencies`,
}

function parseJsonField<T>(value: unknown): T | null {
  if (value == null || value === "") return null
  try {
    return JSON.parse(value as string) as T
  } catch {
    return value as T
  }
}

export const settingsApi = {
  get: async (fields: SettingsField[]): Promise<Partial<ParsedStoreSettings>> => {
    const selections = fields.map((f) => FIELD_QUERIES[f]).join(" ")
    const query = `query Settings { storeSettings { ${selections} } }`
    const data = await gqlClient.request<{ storeSettings: Record<string, unknown> }>(query)
    const storeSettings: Record<string, unknown> = { ...data.storeSettings }
    for (const field of fields) {
      if (JSON_FIELDS.has(field)) {
        storeSettings[field] = parseJsonField(storeSettings[field])
      }
    }
    return storeSettings as Partial<ParsedStoreSettings>
  },
}
