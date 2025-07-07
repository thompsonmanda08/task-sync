"use client";
import React, { useEffect, useState } from "react";
import { InputOtp } from "@heroui/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { LockIcon, UserIcon } from "@/lib/icons";
import {
  logUserIn,
  requestEmailVerification,
  verifyEmailAddress,
} from "@/app/_actions/auth-actions";
import { notify } from "@/lib/utils";
import { Button } from "../ui/button";
import { LoginSchema, RegistrationFormSchema } from "@/types/auth";
import { ErrorState } from "@/types";

function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUnverifiedEmail, setIsUnverifiedEmail] = useState(false);
  const urlParams = useSearchParams();

  const [loginForm, setLoginForm] = useState<LoginSchema>({
    code: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<{
    status: boolean;
    message: string;
  } | null>(null);

  function updateLoginDetails(fields: Partial<LoginSchema>) {
    setLoginForm({ ...loginForm, ...fields });
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    setError(null);
    e.preventDefault();
    setIsLoading(true);


    // IF USER IS UNVERIFIED - VALIDATE PASSCODE FROM VERIFICATION STEP
    if (isUnverifiedEmail) {
      const verify = await verifyEmailAddress({
        email: loginForm?.email,
        code: loginForm?.code,
      });

      if (!verify?.success) {
        notify({
          title: "Verification Error",
          description: verify?.message,
          variant: "destructive",
        });
      }
    }

    // LOG USER IN
    const response = await logUserIn(loginForm);

    if (response?.success) {
      const loginUrl = urlParams?.get("callbackUrl") || "/dashboard";
      router.push(loginUrl);
      notify({
        title: "Authentication Successful",
        description: "You have been logged in successfully.",
      });
      return;
    }

    // IF USER HAS NOT VERIFIED THEIR EMAIL
    if (
      !response?.success &&
      response?.data?.verified === false &&
      response?.message.toLowerCase().split(" ").includes("verify")
    ) {
      notify({
        title: "Authentication Successful",
        description: response?.message,
      });
      setIsUnverifiedEmail(true);
      setIsLoading(false);
      return;
    }

    //**************** IF SOMETHING GOES WRONG *************** //
    setError({ status: true, message: response?.message });
    notify({
      title: "Authentication Error",
      description: response?.message,
      variant: "destructive",
    });
    setIsLoading(false);
    return;
  }

  useEffect(() => {
    setError(null);
  }, [loginForm]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col">
      <form
        onSubmit={handleLogin}
        className="flex w-full flex-col items-center justify-center gap-4"
      >
        {/* IF EMAIL IS NOT VERIFIED */}
        {isUnverifiedEmail ? (
          <VerifyEmail
            isLoading={isLoading}
            formData={loginForm}
            updateFormData={updateLoginDetails}
          />
        ) : (
          <>
            <div className="mb-4 mr-auto">
              <h2 className="font-medium text-primary">WELCOME TO KARIBU</h2>
              <h3 className="my-1 text-[clamp(16px,16px+1vw,48px)] font-bold leading-8">
                Login
              </h3>
            </div>
            <Input
              type="text"
              label="Email / Mobile Number"
              value={loginForm.email}
              name="email"
              isInvalid={error?.status}
              endContent={
                <UserIcon className="pointer-events-none aspect-square h-6 w-6 text-default-400" />
              }
              required={true}
              onChange={(e) => updateLoginDetails({ email: e.target.value })}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={loginForm.password}
              isInvalid={error?.status}
              errorMessage={error?.message}
              required={true}
              endContent={
                <LockIcon className="pointer-events-none aspect-square h-6 w-6 text-default-400" />
              }
              onChange={(e) => updateLoginDetails({ password: e.target.value })}
            />
            <Link
              href={"/reset-password"}
              className="mx-auto flex text-xs font-medium text-primary hover:text-primary/80 md:text-sm"
            >
              Forgot password?
            </Link>

            <Button
              type="submit"
          
              disabled={isLoading}
              isLoading={isLoading}
              className="mt-5 w-full max-w-sm bg-primary font-semibold text-white"
            >
              Login
            </Button>
          </>
        )}
      </form>

      <div className="mt-5 flex flex-col">
        <p className="text-sm text-foreground/80">
          Don&apos;t have account yet?{" "}
          <Link href={"/register"}>
            <span className="font-semibold text-primary underline-offset-4 hover:underline">
              {" "}
              Register
            </span>
          </Link>
        </p>
      
      </div>
    </div>
  );
}

export function VerifyEmail({ isLoading, formData, updateFormData } : {
  isLoading: boolean;
  formData: Partial<RegistrationFormSchema>;
  updateFormData: (fields: Partial<RegistrationFormSchema>) => void;
}) {
  const [count, setCount] = useState(60);
  const [error, setError] = useState<ErrorState | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDownToZero, setIsDownToZero] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((count) => {
        if (count < 0) return 0;

        return count - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count === 0) {
      clearInterval(count);
      setIsDownToZero(true);
    }
  }, [count]);

  async function handleResendOTP() {
    setLoading(true);
    setError({ status: false, message: "" });
    const response = await requestEmailVerification({ email: formData?.email });

    if (response?.success) {
      notify({
        title: "Success",
        description: "Passcode sent successfully to " + formData?.email,
      });
      setCount(60);
      setIsDownToZero(false);
      setLoading(false);
      return;
    }

    notify({
      title: "Error",
      description: response?.message,
      variant: "destructive",
    });
    setError({ status: true, message: response?.message });
    setLoading(false);
    return;
  }
  return (
    <>
      <div className="mb-4 w-full max-w-lg">
        <span className={"font-inter flex font-medium leading-6 text-primary"}>
          VERIFY EMAIL
        </span>
        <h2
          className={`font-inter my-1 text-2xl font-bold leading-8 text-foreground md:text-3xl`}
        >
          Account Verification
        </h2>
      </div>
      {formData?.email ? (
        <p className="-mt-5 text-sm leading-6 text-foreground/60">
          An email with a 6-Digit pass code was sent to the email ending with
          *****{formData?.email.split("@")[0].slice(-3)}
          {"@"}
          {formData?.email.split("@")[1]}
        </p>
      ) : (
        <p className="-mt-5 text-sm leading-6 text-foreground/60">
          An email with a 6-Digit pass code was sent to the email address you
          provided to verify your account.
        </p>
      )}
      <InputOtp
        size="lg"
        isRequired
        variant="bordered"
        className="mr-auto"
        isInvalid={error?.status}
        errorMessage={error?.message}
        name={"passcode"}
        length={6}
        value={formData?.code}
        onValueChange={(code) => updateFormData({ code })}
      />
      <div className="flex w-full justify-between">
        <Button
          type="submit"
          color="primary"
          className="mr-auto"
          isLoading={isLoading}
          isDisabled={isLoading}
          loadingText={"Verifying..."}
          disabled={Number(formData?.code?.length) < 6}
        >
          Verify Code
        </Button>
        {isDownToZero ? (
          <div className="flex items-center justify-center">
            <Button
              className="ml-auto text-sm font-semibold"
              variant="ghost"
              onPress={handleResendOTP}
              type="button"
              isLoading={loading}
              isDisabled={loading}
              loadingText={"Resending..."}
            >
              Resend Passcode
            </Button>
          </div>
        ) : (
          <p className="my-2 mb-10 flex w-full max-w-max items-center justify-start text-sm font-medium leading-snug text-foreground/50">
            Request OTP in:{" "}
            <span className="ml-2 mr-1 font-semibold leading-normal">
              {`0:${count} s`}
            </span>
          </p>
        )}
      </div>
    </>
  );
}

export default LoginForm;
