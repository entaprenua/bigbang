import countries from "i18n-iso-countries"
import en from "i18n-iso-countries/langs/en.json"

countries.registerLocale(en)

export const COUNTRY_OPTIONS = Object.entries(countries.getNames("en"))
  .map(([value, label]) => ({ value, label }))
  .sort((a, b) => a.label.localeCompare(b.label))

export function getCountryName(code: string): string {
  return countries.getName(code, "en") ?? code
}
