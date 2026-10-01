# Auth Components

Email OTP and OAuth authentication components for storefront customer login.

## File Structure

```
src/components/ui/auth/
├── auth-provider.tsx     # AuthProvider, useAuth — global auth context
├── auth-otp.tsx          # OTP flow: providers, steps, fields
├── auth-social.tsx       # OAuth buttons: Google + Facebook
├── oauth-callback.tsx    # OAuth callback handler
├── index.ts              # Barrel exports
└── STRUCTURE.md          # This file
```

## Architecture

```
AuthProvider                          — global auth state (GraphQL mutations, OAuth flow)
  └── AuthOtpFlowProvider             — owns email + step signals
        ├── AuthEmailStep            — renders children when step === 'email'
        │   └── AuthOtpRequestProvider — MutationProvider for requestOtp, auto-advances to verify
        │       └── AuthEmailField   — binds TextField value to flow context email
        └── AuthVerifyStep           — renders children when step === 'verify'
            └── AuthOtpProvider      — MutationProvider for verifyOtp, owns otp signal
                └── AuthOtpField     — binds OTPField value to otp context
```

Consumers provide their own `MutationButton` and `MutationError` from `~/components/ui/query` inside the mutation providers. The auth components only provide the mutation + context wiring.

---

## Components

### AuthProvider

Global authentication context. Provides GraphQL-based `requestOtp`, `verifyOtp`, OAuth flow (`startOAuth`, `completeOAuth`), `logout`, and `refreshUser`. Wraps the entire app — typically mounted in `app.tsx`.

```typescript
type AuthContextType = {
  user: Accessor<StoreCustomer | null>
  isAuthenticated: Accessor<boolean>
  isLoading: Accessor<boolean>
  requestOtp: (email: string) => Promise<OtpResponse>
  verifyOtp: (email: string, otp: string) => Promise<OtpResponse>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  startOAuth: (provider: OAuthProvider) => Promise<void>
  completeOAuth: (code?: string, state?: string) => Promise<OAuthResult>
  setUser: (user: StoreCustomer | null) => void
}

useAuth()
```

### AuthOtpFlowProvider

Owns `email` and `step` signals. Wraps the entire OTP flow.

```typescript
type AuthOtpFlowContextType = {
  email: Accessor<string>
  setEmail: (v: string) => void
  step: Accessor<'email' | 'verify'>
  setStep: (v: 'email' | 'verify') => void
}

useAuthOtpFlow()
```

### AuthEmailStep / AuthVerifyStep

Conditional rendering based on current step. Pure gates with no DOM wrapper — render children only when the step matches.

```tsx
<AuthEmailStep>...</AuthEmailStep>
<AuthVerifyStep>...</AuthVerifyStep>
```

### AuthOtpRequestProvider

Wraps children in `MutationProvider` for `auth.requestOtp(email())`. Auto-advances step to `'verify'` on success. Drop `MutationButton` and `MutationError` inside.

### AuthOtpProvider

Wraps children in `MutationProvider` for `auth.verifyOtp(email(), otp)`. Owns `otp` signal via context. Drop `MutationButton` and `MutationError` inside.

```typescript
type AuthOtpContextType = {
  otp: Accessor<string>
  setOtp: (v: string) => void
}

useAuthOtp()
```

### AuthEmailField

Renders `<TextField>` with reactive `value`/`onChange` bound to `AuthOtpFlowContext.email`. User passes form input as children.

```tsx
<AuthEmailField class="w-full">
  <TextFieldInput type="email" placeholder="Enter your email" />
</AuthEmailField>
```

### AuthOtpField

Renders `<OTPField>` with reactive `value`/`onValueChange` bound to `AuthOtpContext.otp`. User passes `OTPFieldGroup` + `OTPFieldSlot` as children.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxLength` | `number` | `6` | Number of OTP slots |
| `autoVerify` | `boolean` | `false` | Auto-submit mutation on complete |
| `class` | `string` | — | Container class |

```tsx
<AuthOtpField autoVerify maxLength={6}>
  <OTPFieldInput />
  <OTPFieldGroup>
    <OTPFieldSlot index={0} />
    <OTPFieldSlot index={1} />
    <OTPFieldSlot index={2} />
  </OTPFieldGroup>
  <OTPFieldSeparator />
  <OTPFieldGroup>
    <OTPFieldSlot index={3} />
    <OTPFieldSlot index={4} />
    <OTPFieldSlot index={5} />
  </OTPFieldGroup>
</AuthOtpField>
```

### AuthGoogleButton / AuthFacebookButton

OAuth login buttons. Accept all `Button` props (`variant`, `size`, `disabled`, `class`, etc.). Default variant is `"outline"`. Override children to customize the button content.

```tsx
<AuthGoogleButton class="w-full" />
<AuthFacebookButton class="w-full" />
<AuthGoogleButton variant="ghost" size="lg">Sign in with Google</AuthGoogleButton>
```

### OAuthCallbackHandler

Handles OAuth redirect callback. Reads `code` and `state` from URL, wraps the exchange in a `QueryProvider` with retry disabled, and auto-redirects on success.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fallbackRedirect` | `string` | `/` | Redirect URL fallback |
| `autoRedirect` | `boolean` | `true` | Auto-redirect on success |

```tsx
// On callback page (e.g. /auth/callback)
<OAuthCallbackHandler fallbackRedirect="/">
  <p>Completing sign-in...</p>
</OAuthCallbackHandler>
```

---

## Usage

### Full OTP Flow

```tsx
import {
  AuthOtpFlowProvider,
  AuthEmailStep,
  AuthVerifyStep,
  AuthOtpRequestProvider,
  AuthOtpProvider,
  AuthEmailField,
  AuthOtpField,
} from '~/components/ui/auth'
import { TextFieldInput } from '~/components/ui/text-field'
import { OTPFieldGroup, OTPFieldSlot, OTPFieldInput, OTPFieldSeparator } from '~/components/ui/otp-field'
import { MutationButton, MutationError } from '~/components/ui/query'

<AuthOtpFlowProvider>
  <AuthEmailStep>
    <AuthOtpRequestProvider>
      <AuthEmailField>
        <TextFieldInput type="email" placeholder="Enter your email" />
      </AuthEmailField>
      <MutationError />
      <MutationButton>Send Code</MutationButton>
    </AuthOtpRequestProvider>
  </AuthEmailStep>

  <AuthVerifyStep>
    <AuthOtpProvider>
      <AuthOtpField>
        <OTPFieldInput />
        <OTPFieldGroup>
          <OTPFieldSlot index={0} />
          <OTPFieldSlot index={1} />
          <OTPFieldSlot index={2} />
        </OTPFieldGroup>
        <OTPFieldSeparator />
        <OTPFieldGroup>
          <OTPFieldSlot index={3} />
          <OTPFieldSlot index={4} />
          <OTPFieldSlot index={5} />
        </OTPFieldGroup>
      </AuthOtpField>
      <MutationError />
      <MutationButton>Verify</MutationButton>
    </AuthOtpProvider>
  </AuthVerifyStep>
</AuthOtpFlowProvider>
```

### Auto-Verify on OTP Complete

```tsx
<AuthOtpProvider>
  <AuthOtpField autoVerify>
    <OTPFieldInput />
    <OTPFieldGroup>
      <OTPFieldSlot index={0} />
      <OTPFieldSlot index={1} />
      <OTPFieldSlot index={2} />
    </OTPFieldGroup>
    <OTPFieldSeparator />
    <OTPFieldGroup>
      <OTPFieldSlot index={3} />
      <OTPFieldSlot index={4} />
      <OTPFieldSlot index={5} />
    </OTPFieldGroup>
  </AuthOtpField>
</AuthOtpProvider>
```

No button — auto-submits when all slots are filled.

### OAuth Login

```tsx
import { AuthGoogleButton, AuthFacebookButton, OAuthCallbackHandler } from '~/components/ui/auth'

<AuthGoogleButton />
<AuthFacebookButton />

// On callback page (e.g. /auth/callback)
<OAuthCallbackHandler fallbackRedirect="/">
  <p>Completing sign-in...</p>
</OAuthCallbackHandler>
```

---

## Context Hierarchy

```
AuthProvider (global, from app.tsx)
  └── AuthOtpFlowProvider
        ├── AuthOtpRequestProvider (MutationProvider)
        │     ├── AuthEmailField → TextField → consumer's input
        │     ├── consumer's MutationButton
        │     └── consumer's MutationError
        └── AuthOtpProvider (MutationProvider)
              ├── AuthOtpField → OTPField → consumer's OTPFieldGroup + OTPFieldSlot
              ├── consumer's MutationButton
              └── consumer's MutationError
```

---

## Exports

| Export | Provider |
|--------|----------|
| `AuthProvider`, `useAuth` | Global auth state |
| `AuthOtpFlowProvider`, `useAuthOtpFlow` | OTP flow (email + step) |
| `AuthEmailStep`, `AuthVerifyStep` | Step gates |
| `AuthOtpRequestProvider` | Request OTP mutation |
| `AuthOtpProvider`, `useAuthOtp` | Verify OTP mutation + otp signal |
| `AuthEmailField` | Bound email TextField |
| `AuthOtpField` | Bound OTPField |
| `AuthGoogleButton`, `AuthFacebookButton` | OAuth login buttons |
| `OAuthCallbackHandler` | OAuth callback handler |
