import {
  AuthOtpFlowProvider,
  AuthEmailStep,
  AuthVerifyStep,
  AuthEmailField,
  AuthOtpRequestProvider,
  AuthOtpProvider,
  AuthOtpField,
  AuthGoogleButton,
  AuthFacebookButton,
} from "~/components/ui/auth"
import { MutationButton, MutationError } from "~/components/ui/query"
import { TextFieldInput } from "~/components/ui/text-field"
import {
  OTPFieldInput,
  OTPFieldGroup,
  OTPFieldSlot,
  OTPFieldSeparator,
} from "~/components/ui/otp-field"

export const LoginForm = () => {
  return (
    <AuthOtpFlowProvider>
      <AuthEmailStep>
        <div class="flex flex-col gap-3">
          <AuthEmailField>
            <TextFieldInput type="email" placeholder="Enter your email" />
          </AuthEmailField>
          <AuthOtpRequestProvider>
            <MutationButton class="w-full">Send code</MutationButton>
            <MutationError class="mt-2 text-sm" />
          </AuthOtpRequestProvider>
        </div>
      </AuthEmailStep>

      <AuthVerifyStep>
        <div class="flex flex-col gap-3">
          <AuthOtpProvider register={false}>
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
            <MutationButton class="w-full">Verify code</MutationButton>
            <MutationError class="mt-2 text-sm" />
          </AuthOtpProvider>
        </div>
      </AuthVerifyStep>

      <SocialAuth />
    </AuthOtpFlowProvider>
  )
}

export const SocialAuth = () => {
  return (
    <>
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-border" />
        </div>
        <div class="relative flex justify-center">
          <span class="bg-card px-3 text-xs text-muted-foreground">or continue with</span>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <AuthGoogleButton />
        <AuthFacebookButton />
      </div>
    </>
  )
}
