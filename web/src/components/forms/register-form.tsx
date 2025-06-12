"use client";
import React, { useEffect, useState } from "react";
import { Link, Checkbox, Alert } from "@heroui/react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import useCustomTabsHook from "@/hooks/use-custom-tabs";
import { Input } from "../ui/input";
import Confetti from "react-confetti";
import Lottie from "react-lottie-player";

import successLottie from "../../../public/lottie/success.json";
import { LucideEye, LucideEyeOff, LucideMail, Smartphone } from "lucide-react";
import { Button } from "../ui/button";
import {
  registerNewUser,
  verifyEmailAddress,
} from "@/app/_actions/auth-actions";
import { cn, notify } from "@/lib/utils";
import { LockIcon, UserIcon } from "@/lib/icons";
import { VerifyEmail } from "./login-form";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegistrationFormSchema } from "@/types/auth";
import { ErrorState } from "@/types";




const INIT_FORM = {
  firstName:"",
  lastName:"",
  phone:"",
  email:"",
  password:"",
  confirmPassword:"",
} as RegistrationFormSchema;

export default function SignUpForm() {
  const { push } = useRouter();
  const [error, setError] = useState<ErrorState | null>();
  const [newUser, setNewUser] = useState<RegistrationFormSchema>(INIT_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnverifiedEmail, setIsUnverifiedEmail] = useState(false);
  const [isCompletedRegistration, setIsCompletedRegistration] = useState(false);

  function updateUserDetails(fields: Partial<RegistrationFormSchema>) {
    setNewUser({ ...newUser, ...fields });
  }

  function clearContext() {
    setNewUser(INIT_FORM);
    setError(null);
    setIsCompletedRegistration(false);
  }

  const {
    activeTab,
    navigateForward,
    navigateBackwards,
    navigateTo,
    currentTabIndex,
    firstTab,
    lastTab,
    isLastStep,
    isFirstStep,
  } = useCustomTabsHook([
    <RegisterFormFields
      key="registration-info"
      updateUserDetails={updateUserDetails}
  
    />,

    <VerifyEmail
      key={"password-info"}
      isLoading={isLoading}
      formData={newUser}
      updateFormData={updateUserDetails}
    />,
  ]);

  async function handleCreateAccount(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    let response = {
      status: 500,
      message: "",
      success: false,
      data: null,
    };

    //********* STEP 0: ACCOUNT INITIALIZATION ************ //
    if (isFirstStep) {
      response = await registerNewUser({
        firstName: newUser?.firstName,
        lastName: newUser?.lastName,
        phone: newUser?.phone,
        email: newUser?.email,
        password: newUser?.password,
        isStudent:  false,
        university: "cm4wghfmb001r0173fbakc4e9",
        country: "cm4wghf12000a0173kv0rg801",
      });

      if (response?.success) {
        setIsUnverifiedEmail(true); // NEW USER NEEDS TO VERIFY EMAIL
        setIsLoading(false);
        navigateForward(); // TO VERIFY EMAIL STEP
        return;
      }
    }

    //********* STEP 1: ACCOUNT VERIFICATION ************ //
    if (isLastStep) {
      response = await verifyEmailAddress({
        email: newUser?.email,
        code: newUser?.code,
      });

      if (response?.success) {
        setIsCompletedRegistration(true);
        setIsLoading(false);
        return;
      }
    }

    //**************** IF SOMETHING GOES WRONG *************** //
    setError({ status: true, type: "error", message: response?.message });
    notify({
      title: "Error",
      description: response?.message,
      variant: "destructive",
    });
    setIsLoading(false);
    return;
  }



  return (
    <div className="flex w-full flex-col overflow-clip">
      {isCompletedRegistration ? (
        <CompletedRegistrationPrompt handleReset={clearContext} />
      ) : (
        <>
          <form onSubmit={handleCreateAccount} className="flex flex-col gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTabIndex}
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -200 }}
                transition={{ duration: 0.5 }}
                className={cn(
                  "flex flex-col w-full justify-center items-center gap-4",
                  {
                    "mb-2": error?.status,
                  },
                )}
              >
                {activeTab}
              </motion.div>
            </AnimatePresence>
            {error && error?.status && (
              <Alert color="danger" title={error?.message} variant="faded" />
            )}
            {isFirstStep && (
              <Button
                type={"submit"}
                disabled={isLoading}
                isLoading={isLoading}
                className="mt-5 w-full bg-primary font-semibold text-white"
              >
                Create Account
              </Button>
            )}
          </form>

          <div className="mr-auto mt-5 flex flex-col items-start justify-start">
            <p className="text-sm text-foreground/80">
              Already have account?{" "}
              <Link href={"/login"}>
                <span className="text-primary underline-offset-4 hover:underline">
                  Login
                </span>
              </Link>
            </p>
            <br />
            {/* <p className="text-sm tracking-wide text-foreground/80">
              Are you a property manager or landlord?{" "}
              <Link href={"https://pms.taskSync.space/auth/register"}>
                <span className="text-primary underline-offset-4 hover:underline">
                  Register here
                </span>
              </Link>
            </p> */}
          </div>
        </>
      )}
    </div>
  );
}

function RegisterFormFields({ updateUserDetails }: {
  updateUserDetails: (fields: Partial<RegistrationFormSchema>) => void;}) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const errors: string[] = [];

  if (password.length < 6) {
    errors.push("Password must be 6 characters or more.");
  }
  if ((password.match(/[A-Z]/g) || []).length < 1) {
    errors.push("Password must include at least 1 upper case letter");
  }

  if ((password.match(/[^a-z]/gi) || []).length < 1) {
    errors.push("Password must include at least 1 symbol.");
  }

  useEffect(() => {
    updateUserDetails({ password });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);
  return (
    <>
      <div className="mb-4 mr-auto">
        <h2 className="font-medium text-primary">WELCOME TO KARIBU</h2>
        <h3 className="my-1 text-[clamp(16px,16px+1vw,48px)] font-bold leading-8 text-foreground">
          Create an account
        </h3>
      </div>
      <div className="flex gap-4">
        <Input
          type="text"
          label="First Name"
          name="firstName"
          required={true}
          endContent={
            <UserIcon className="pointer-events-none mb-1 aspect-square h-6 w-6 text-default-400" />
          }
          onChange={(e) => {
            updateUserDetails({ firstName: e.target.value });
          }}
        />
        <Input
          type="text"
          label="Last Name"
          name="lastName"
          required={true}
          endContent={
            <UserIcon className="pointer-events-none mb-1 aspect-square h-6 w-6 text-default-400" />
          }
          onChange={(e) => {
            updateUserDetails({ lastName: e.target.value });
          }}
        />
      </div>
      <Input
        type="text"
        label="Mobile Number"
        name="phone"
        required={true}
        endContent={
          <Smartphone className="pointer-events-none mb-1 aspect-square h-6 w-6 text-default-400" />
        }
        onChange={(e) => {
          updateUserDetails({ phone: e.target.value });
        }}
      />
      <Input
        type="text"
        label="Email"
        name="email"
        required={true}
        endContent={
          <LucideMail className="pointer-events-none mb-1 aspect-square h-6 w-6 text-default-400" />
        }
        onChange={(e) => {
          updateUserDetails({ email: e.target.value });
        }}
      />

      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        name="password"
        required={true}
        isInvalid={errors.length > 0 && password.length > 0}
        errorMessage={() => (
          <ul className="flex flex-col gap-1">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        )}
        value={password}
        variant="bordered"
        onValueChange={setPassword}
        endContent={
          <LockIcon className="pointer-events-none aspect-square h-6 w-6 text-default-400" />
        }
      />
      <Input
        label="Confirm Password"
        type={showPassword ? "text" : "password"}
        name="password2"
        isInvalid={
          confirmPassword.length > 0 && Boolean(password != confirmPassword)
        }
        errorMessage="Passwords do not match"
    
        required={true}
        onValueChange={setConfirmPassword}
      />

      <div className="mt-4 flex flex-col items-start gap-2">
        <Checkbox
          classNames={{ label: "-mt-[6px]" }}
          className="items-start"
          isRequired
          title="You must agree to the terms to proceed"
          onChange={(e) =>
            updateUserDetails({
              agreeToTerms: e.target.checked,
            })
          }
        >
          <span className="text-foregroun/50 text-xs leading-snug tracking-wide md:text-sm">
            By signing up you agree to the{" "}
            <Link href="#" className="text-sm text-primary-600">
              Terms
            </Link>{" "}
            and the{" "}
            <Link href="#" className="text-sm text-primary-600">
              Conditions
            </Link>{" "}
            and the{" "}
            <Link href="#" className="text-sm text-primary-600">
              Privacy Policy
            </Link>{" "}
            of TaskSync.
          </span>
        </Checkbox>
      </div>
    </>
  );
}

export function CompletedRegistrationPrompt({ handleReset }: {
  handleReset: () => void;}) {
  return (
    <>
      <div className="absolute inset-x-0 top-0 w-full justify-center bg-red-500">
        <Confetti />
      </div>
      <motion.div
        whileInView={{
          opacity: [0, 1],
          scaleX: [0.8, 1],
          transition: {
            type: "spring",
            stiffness: 300,
            ease: "easeInOut",
            duration: 0.25,
          },
        }}
        className="relative z-0 mx-auto my-20 flex w-full max-w-[412px] flex-col gap-4 px-5 md:mt-20 md:max-w-[560px]"
      >
        <span className="mx-auto max-w-max rounded-full border border-primary/20 p-1 px-4 font-semibold text-primary">
          Account Created Successfully!
        </span>
        <span className="max-w-md text-center text-sm font-medium leading-6 text-foreground/60">
          You account has been created, use the credentials you provided to
          login and find your dream home!
        </span>
        <div className="mx-auto max-w-sm object-contain">
          <Lottie
            loop
            animationData={successLottie}
            play
            style={{ width: 220, height: 220 }}
          />
        </div>
        <Button
          as={Link}
          href={"/login"}
          onPress={() => setTimeout(() => handleReset(), 2000)}
          className={"my-4 w-full"}
        >
          Login
        </Button>
      </motion.div>
    </>
  );
}
