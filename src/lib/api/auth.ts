import { apiFetch } from "./client"

export interface AuthMeResponse {
  success: boolean
  data: {
    id: string
    email: string
    name: string | null
    phone: string | null
    avatarUrl: string | null
  } | null
}

export async function me(): Promise<AuthMeResponse["data"]> {
  const json = await apiFetch("/auth/me") as AuthMeResponse
  return json.data ?? null
}

export interface RequestOtpResponse {
  success: boolean
  data: { success: boolean; email: string; message: string }
}

export async function requestOtp(email: string): Promise<RequestOtpResponse["data"]> {
  const json = await apiFetch("/auth/request-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  }) as RequestOtpResponse
  return json.data
}

export interface VerifyOtpResponse {
  success: boolean
  data: {
    success: boolean
    customer: { id: string; email: string; name: string | null; phone: string | null; avatarUrl: string | null } | null
    message?: string
  }
}

export async function verifyOtp(email: string, otp: string): Promise<VerifyOtpResponse["data"]> {
  const json = await apiFetch("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  }) as VerifyOtpResponse
  return json.data
}

export interface RegisterCustomerInput {
  email: string
  name?: string | null
  phone?: string | null
  avatarUrl?: string | null
  identityProvider: string
  emailVerified: boolean
  oauthProviderId?: string | null
}

export interface RegisterCustomerResponse {
  success: boolean
  data: {
    success: boolean
    customer: { id: string; email: string; name: string | null; phone: string | null; avatarUrl: string | null } | null
  }
}

export async function registerCustomer(input: RegisterCustomerInput): Promise<RegisterCustomerResponse["data"]> {
  const json = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  }) as RegisterCustomerResponse
  return json.data
}

export async function logout(): Promise<void> {
  await apiFetch("/auth/logout", { method: "POST" })
}
