"use server"

import { apiFetch } from "./server"
import { sendEmail } from "~/lib/email"

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

export async function requestOtp(email: string, otp: string): Promise<RequestOtpResponse["data"]> {
  const json = await apiFetch("/auth/request-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  }) as RequestOtpResponse

  if (json.data?.success) {
    await sendEmail({
      to: email,
      subject: "Your verification code",
      html: `<p>Your one-time code is</p><strong>${otp}</strong>`,
      text: `Your one-time code is ${otp}`,
    })
  }

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
  console.log("[verify-otp] raw json:", json)
  console.log("[verify-otp] json.data:", json.data)
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

export interface UpdateProfileInput {
  name?: string | null
  phone?: string | null
  avatarUrl?: string | null
}

export interface UpdateProfileResponse {
  success: boolean
  data: {
    id: string
    email: string
    name: string | null
    phone: string | null
    avatarUrl: string | null
  } | null
}

export async function updateProfile(input: UpdateProfileInput): Promise<UpdateProfileResponse["data"]> {
  const json = await apiFetch("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  }) as UpdateProfileResponse
  return json.data
}
