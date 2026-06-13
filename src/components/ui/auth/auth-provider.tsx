import { createContext, useContext, createSignal, onMount, type ParentComponent, type Accessor } from 'solid-js'
import { me as fetchMe, requestOtp as apiRequestOtp, verifyOtp as apiVerifyOtp, logout as apiLogout } from '~/lib/api/auth'
import { apiFetch } from '~/lib/api/client'
import { startOAuth as startServerOAuth, exchangeOAuth as exchangeServerOAuth } from '~/lib/oauth'
import type { OAuthProvider } from '~/lib/oauth'

export type StoreCustomer = {
  id: string
  email: string
  name: string | null
  phone: string | null
  avatarUrl: string | null
  storeId: string
  emailVerified: boolean
  identityProvider?: string
}

interface OtpResponse {
  success: boolean
  message?: string
  customer?: StoreCustomer
}

interface OAuthResult {
  success: boolean
  redirectUrl?: string
  customer?: StoreCustomer
  error?: string
}

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType>()

export const AuthProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal<StoreCustomer | null>(null)
  const [isLoading, setIsLoading] = createSignal(true)

  const isAuthenticated = () => !!user()

  const requestOtp = async (email: string): Promise<OtpResponse> => {
    try {
      const result = await apiRequestOtp(email)
      return { success: result.success, message: result.message }
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : 'Request failed' }
    }
  }

  const verifyOtp = async (email: string, otp: string): Promise<OtpResponse> => {
    try {
      const result = await apiVerifyOtp(email, otp)
      if (result.success && result.customer) {
        const customer: StoreCustomer = {
          id: result.customer.id,
          email: result.customer.email,
          name: result.customer.name,
          phone: result.customer.phone,
          avatarUrl: result.customer.avatarUrl,
          storeId: '',
          emailVerified: true,
          identityProvider: 'LOCAL',
        }
        setUser(customer)
        return { success: true, customer }
      }
      return { success: result.success, message: result.message }
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : 'Verification failed' }
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await apiLogout()
    } catch {
      // Ignore
    } finally {
      setUser(null)
    }
  }

  const refreshUser = async (): Promise<void> => {
    const currentUser = user()
    if (!currentUser?.id) return

    try {
      const customer = await fetchMe()
      if (customer) {
        setUser({
          id: customer.id,
          email: customer.email,
          name: customer.name,
          phone: customer.phone,
          avatarUrl: customer.avatarUrl,
          storeId: currentUser.storeId,
          emailVerified: true,
          identityProvider: currentUser.identityProvider,
        })
      }
    } catch {
      // Network error, keep current state
    }
  }

  const startOAuth = async (provider: OAuthProvider): Promise<void> => {
    try {
      const { url, state } = await startServerOAuth(provider, window.location.origin)
      sessionStorage.setItem(`oauth:${state}`, provider)
      window.location.href = url
    } catch (err) {
      console.error('OAuth start failed:', err)
    }
  }

  const completeOAuth = async (_code?: string, _state?: string): Promise<OAuthResult> => {
    const params = new URLSearchParams(window.location.search)
    const code = _code || params.get('code')
    const state = _state || params.get('state')

    if (!code || !state) {
      return { success: false, error: 'Missing OAuth parameters' }
    }

    const provider = sessionStorage.getItem(`oauth:${state}`)
    if (!provider) {
      return { success: false, error: 'No matching OAuth session' }
    }

    try {
      const result = await exchangeServerOAuth(provider, code, state, window.location.origin)
      sessionStorage.removeItem(`oauth:${state}`)
      if (result.success && result.customer) {
        const customer: StoreCustomer = {
          id: result.customer.id,
          email: result.customer.email,
          name: result.customer.name ?? null,
          phone: result.customer.phone ?? null,
          avatarUrl: result.customer.avatarUrl ?? null,
          storeId: '',
          emailVerified: true,
          identityProvider: provider.toUpperCase(),
        }
        setUser(customer)
        return { success: true, customer }
      }
      return { success: false, error: 'OAuth exchange failed' }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'OAuth authentication failed'
      return { success: false, error: message }
    }
  }

  onMount(async () => {
    try {
      await apiFetch("/sessions")
    } catch (e) {
      console.warn("Session creation failed (cart may not persist):", e)
    }
    setIsLoading(false)
  })

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        requestOtp,
        verifyOtp,
        logout,
        refreshUser,
        startOAuth,
        completeOAuth,
        setUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
