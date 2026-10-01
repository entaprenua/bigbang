import { me as fetchMe } from "./auth"

export interface Customer {
  id: string
  email: string
  name: string | null
  phone: string | null
  avatarUrl: string | null
}

export const customerApi = {
  me: async (): Promise<Customer | null> => {
    return fetchMe()
  },
}
