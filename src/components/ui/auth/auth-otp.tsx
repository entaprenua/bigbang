import {
  createContext,
  useContext,
  createSignal,
  Show,
  splitProps,
  type Accessor,
  type JSX,
} from "solid-js"
import { MutationProvider, useMutationState } from "~/components/ui/query"
import { TextField } from "../text-field"
import { OTPField } from "../otp-field"
import { useAuth } from "./auth-provider"
import { cn } from "~/lib/utils"

// ─── AuthOtpFlowProvider ──────────────────────────────────────

interface AuthOtpFlowContextType {
  email: Accessor<string>
  setEmail: (v: string) => void
  step: Accessor<"email" | "verify">
  setStep: (v: "email" | "verify") => void
}

const AuthOtpFlowContext = createContext<AuthOtpFlowContextType>()

function AuthOtpFlowProvider(props: { children?: JSX.Element }) {
  const [email, setEmail] = createSignal("")
  const [step, setStep] = createSignal<"email" | "verify">("email")

  return (
    <AuthOtpFlowContext.Provider value={{ email, setEmail, step, setStep }}>
      {props.children}
    </AuthOtpFlowContext.Provider>
  )
}

function useAuthOtpFlow() {
  const ctx = useContext(AuthOtpFlowContext)
  if (!ctx) throw new Error("useAuthOtpFlow must be used within AuthOtpFlowProvider")
  return ctx
}

// ─── Steps ────────────────────────────────────────────────────

interface AuthEmailStepProps {
  children?: JSX.Element
}

const AuthEmailStep = (props: AuthEmailStepProps) => {
  const { step } = useAuthOtpFlow()
  return <Show when={step() === "email"}>{props.children}</Show>
}

interface AuthVerifyStepProps {
  children?: JSX.Element
}

const AuthVerifyStep = (props: AuthVerifyStepProps) => {
  const { step } = useAuthOtpFlow()
  return <Show when={step() === "verify"}>{props.children}</Show>
}

// ─── AuthEmailField ───────────────────────────────────────────

interface AuthEmailFieldProps {
  class?: string
  children?: JSX.Element
}

const AuthEmailField = (props: AuthEmailFieldProps) => {
  const [local, others] = splitProps(props, ["class", "children"])
  const { email, setEmail } = useAuthOtpFlow()

  return (
    <TextField
      class={cn("w-full", local.class)}
      value={email()}
      onChange={setEmail}
      {...others}
    >
      {local.children}
    </TextField>
  )
}

// ─── AuthOtpRequestProvider ───────────────────────────────────

interface AuthOtpRequestProviderProps {
  children?: JSX.Element
}

function AuthOtpRequestProvider(props: AuthOtpRequestProviderProps) {
  const auth = useAuth()
  const { email, setStep } = useAuthOtpFlow()

  return (
    <MutationProvider
      mutationFn={async () => auth.requestOtp(email())}
      onSuccess={() => setStep("verify")}
    >
      {props.children}
    </MutationProvider>
  )
}

// ─── AuthOtpProvider ─────────────────────────────────────────

interface AuthOtpContextType {
  otp: Accessor<string>
  setOtp: (v: string) => void
}

const AuthOtpContext = createContext<AuthOtpContextType>()

interface AuthOtpProviderProps {
  children?: JSX.Element
}

function AuthOtpProvider(props: AuthOtpProviderProps) {
  const [otp, setOtp] = createSignal("")
  const auth = useAuth()
  const { email } = useAuthOtpFlow()

  return (
    <AuthOtpContext.Provider value={{ otp, setOtp }}>
      <MutationProvider
        mutationFn={async () => auth.verifyOtp(email(), otp())}
      >
        {props.children}
      </MutationProvider>
    </AuthOtpContext.Provider>
  )
}

function useAuthOtp() {
  const ctx = useContext(AuthOtpContext)
  if (!ctx) throw new Error("useAuthOtp must be used within AuthOtpProvider")
  return ctx
}

// ─── AuthOtpField ────────────────────────────────────────────

interface AuthOtpFieldProps {
  autoVerify?: boolean
  maxLength?: number
  class?: string
  children?: JSX.Element
}

const AuthOtpField = (props: AuthOtpFieldProps) => {
  const [local, others] = splitProps(props, ["class", "maxLength", "autoVerify", "children"])
  const { otp, setOtp } = useAuthOtp()
  const mutation = useMutationState()

  return (
    <OTPField
      class={cn("w-full justify-center", local.class)}
      maxLength={local.maxLength ?? 6}
      value={otp()}
      onValueChange={(v: string) => setOtp(v)}
      onComplete={local.autoVerify ? () => mutation?.mutate() : undefined}
      {...others}
    >
      {local.children}
    </OTPField>
  )
}

// ─── Exports ──────────────────────────────────────────────────

export {
  AuthOtpFlowProvider,
  useAuthOtpFlow,
  AuthEmailStep,
  AuthVerifyStep,
  AuthEmailField,
  AuthOtpRequestProvider,
  AuthOtpProvider,
  useAuthOtp,
  AuthOtpField,
}

export type {
  AuthOtpFlowContextType,
  AuthOtpContextType,
}
