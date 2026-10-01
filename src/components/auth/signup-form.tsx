import {
  AuthOtpFlowProvider,
  AuthEmailStep,
  AuthVerifyStep,
  AuthNameField,
  AuthEmailField,
  AuthPhoneField,
  AuthOtpRequestProvider,
  AuthOtpProvider,
  AuthOtpField,
} from "~/components/ui/auth"
import { MutationButton, MutationError } from "~/components/ui/query"
import { TextFieldInput } from "~/components/ui/text-field"
import {
  OTPFieldInput,
  OTPFieldGroup,
  OTPFieldSlot,
  OTPFieldSeparator,
} from "~/components/ui/otp-field"
import { SocialAuth } from "./login-form"

export const SignupForm = () => {
  return (
    <AuthOtpFlowProvider>
      <AuthEmailStep>
        <div class="flex flex-col gap-3">
          <AuthNameField>
            <TextFieldInput type="text" placeholder="Your name" />
          </AuthNameField>
          <AuthEmailField>
            <TextFieldInput type="email" placeholder="Enter your email" />
          </AuthEmailField>
          <AuthPhoneField>
            <TextFieldInput type="tel" placeholder="Phone number (optional)" />
          </AuthPhoneField>
          <AuthOtpRequestProvider>
            <MutationButton class="w-full">Send code</MutationButton>
            <MutationError class="mt-2 text-sm" />
          </AuthOtpRequestProvider>
        </div>
      </AuthEmailStep>

      <AuthVerifyStep>
        <div class="flex flex-col gap-3">
          <AuthOtpProvider register>
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
