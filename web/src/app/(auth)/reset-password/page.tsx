"use client";

import {
  initiatePasswordReset,
  resetPassword,
  validateOTPCode,
} from "@/app/_actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import useCustomTabsHook from "@/hooks/use-custom-tabs";
import { notify } from "@/lib/utils";
import { PasswordResetSchema } from "@/types/auth";
import { InputOtp } from "@heroui/react";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";

export default function PasswordReset() {
  const [formData, setFormData] = useState<PasswordResetSchema>({
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
    token: "",
  });

  function updateFormData(fields: Partial<PasswordResetSchema>) {
    setFormData({ ...formData, ...fields });
  }

  const {
    currentTabIndex,
    activeTab,
    navigateTo,
    navigateForward,
    navigateBackwards,
    isLoading,
    setIsLoading,
  } = useCustomTabsHook([
    <ResetMyPassword
      key={"reset-password"}
      handleRequestOTPCode={handleRequestOTPCode}
      formData={formData}
      updateFormData={updateFormData}
    />,
    <ValidatePassCode
      key={"validate-code"}
      handleValidatePassCode={handleValidatePassCode}
      formData={formData}
      updateFormData={updateFormData}
    />,
    <CreateNewPassword
      key={"new-password"}
      handleCreateNewPassword={handleCreateNewPassword}
      formData={formData}
      updateFormData={updateFormData}
    />,
    <Success key={"success"} />,
  ]);

  async function handleRequestOTPCode() {
    setIsLoading(true);

    const response = await initiatePasswordReset({ email: formData.email });

    if (response.success) {
      notify({
        title: "Success",
        description: "Password reset code sent successfully",
      });
      navigateForward();
    } else {
      notify({
        title: "Error",
        description: response?.message,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  async function handleValidatePassCode() {
    setIsLoading(true);

    const response = await validateOTPCode({
      email: formData.email,
      code: formData.code,
    });

    if (response.success) {
      updateFormData({ token: response.data.token });
      notify({
        title: "Success",
        description: "Pass Code validated successfully",
      });
      navigateForward();
    } else {
      notify({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  async function handleCreateNewPassword() {
    setIsLoading(true);
    const response = await resetPassword({
      newPassword: formData.password,
      token: formData.token,
    });

    if (response.success) {
      notify({
        title: "Success",
        description: "Password Changed successfully",
      });
      navigateForward();
    } else {
      notify({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col gap-4 h-full items-center lg:justify-center my-12 p-12">
      <div className="md:w-3/4 lg:w-4/5 mx-auto flex flex-col justify-center items-center">
        <div className="mb-4 w-full max-w-lg">
          <span
            className={"font-inter flex text-primary font-medium leading-6"}
          >
            LOST ACCESS TO YOUR ACCOUNT?
          </span>
          <h2
            className={`font-inter font-bold md:text-3xl text-2xl text-slate-800 leading-8 my-1`}
          >
            Account Password Reset
          </h2>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTabIndex}
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -200 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4 mt-8 max-w-lg items-center justify-center"
          >
            {isLoading ? (
              <Loader
                removeWrapper
                className="flex justify-center items-center my-10"
                loadingText={"Please wait..."}
              />
            ) : (
              activeTab
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ResetMyPassword({
  handleRequestOTPCode,
  updateFormData,
  formData,
}:{
  handleRequestOTPCode: () => Promise<void>,
  updateFormData: (fields: Partial<PasswordResetSchema>) => void,
  formData: PasswordResetSchema
}) {
  return (
    <form
      onSubmit={handleRequestOTPCode}
      className="flex flex-col gap-4 w-full"
    >
      <p className="text-slate-500 tracking-tight leading-6 text-sm xl:text-base -mt-5">
        An email with a 6-Digit pass code will sent to the email address.
        Provide the code in the next step for verification.
      </p>

      <Input
        isRequired
        label={"Email Address"}
        type={"email"}
        name={"email"}
        value={formData?.email}
        onChange={(e) =>
          updateFormData({
            email: e.target.value,
          })
        }
      />
      <Button type="submit" className={"w-full"} size="lg" color="primary">
        Request Code
      </Button>
    </form>
  );
}

export function ValidatePassCode({
  handleValidatePassCode,
  updateFormData,
  formData,
}: {
  handleValidatePassCode: () => Promise<void>;
  updateFormData: (fields: Partial<PasswordResetSchema>) => void;
  formData: PasswordResetSchema;
}) {
  return (
    <>
      <p className="text-slate-500 tracking-tight leading-5 text-sm xl:text-base -mt-5">
        An email with a 6-Digit pass code was sent to the email address you
        provided to verify that the account belongs to you.
      </p>

      <InputOtp
        size="lg"
        isRequired
        variant="bordered"
        // className="mr-auto"
        name={"passcode"}
        length={6}
        value={formData?.code}
        onValueChange={(code) => updateFormData({ code })}
      />
      <Button
        className={"w-full"}
      
        color="primary"
        disabled={formData?.code?.length! < 6}
        onPress={() => {
          if (formData?.code?.length! < 6) {
            return;
          } else {
            handleValidatePassCode();
          }
        }}
      >
        Verify Code
      </Button>
    </>
  );
}

export function CreateNewPassword({
  handleCreateNewPassword,
  updateFormData,
  formData,
}: {
  handleCreateNewPassword: () => Promise<void>;
  updateFormData: (fields: Partial<PasswordResetSchema>) => void;
  formData: PasswordResetSchema;
}) {
  const [confirmPassword, setConfirmPassword] = useState("");

  const errors: string[] = [];

  if (formData.password && formData.password.length < 4) {
    errors.push("Password must be 4 characters or more.");
  }
  if (formData.password &&  (formData.password.match(/[A-Z]/g) || []).length < 1) {
    errors.push("Password must include at least 1 upper case letter");
  }

  if (formData.password &&(formData.password.match(/[^a-z]/gi) || []).length < 1) {
    errors.push("Password must include at least 1 symbol.");
  }

  const isInvalidPassword = errors.length > 0 && formData.password && formData.password.length > 0;
  const passMatchErr =
    confirmPassword.length > 0 && confirmPassword !== formData.password;

  return (
    <>
      <p className="text-slate-500 tracking-tight leading-5 text-sm xl:text-base -mt-5">
        Create a new password that you don&apos;t use on any other accounts.
        Make sure its secure and safe.
      </p>
      {/* Create Password */}
      <Input
        label={"New Password"}
        required={true}
        isInvalid={Boolean(isInvalidPassword)}
        errorMessage={() => (
          <ul className="flex flex-col gap-1">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        )}
        value={formData.password}
        onChange={(e) =>
          updateFormData({
            password: e.target.value,
          })
        }
        name={"password"}
        type={"password"}
      />
      {/* Confirm Password */}

      <Input
        label={"Confirm Password"}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        name={"confirmPassword"}
        type={"password"}
        isInvalid={passMatchErr}
        errorMessage={"Passwords do not match"}
      />
      {/* ERROR MESSAGE */}

      <Button
        className={"w-full"}
        color="primary"
        isDisabled={Boolean(isInvalidPassword)}
        onPress={() => {
          if (isInvalidPassword || passMatchErr) {
            return;
          } else {
            handleCreateNewPassword();
          }
        }}
      >
        Reset Password
      </Button>
    </>
  );
}

export function Success({}) {
  return (
    <>
      <div className="flex flex-col justify-center items-center ">
        <p className="text-slate-500 tracking-tight leading-8  -mt-5 mb-5">
          Your password has been{" "}
          <span className="font-bold text-primary">successfully reset</span>.
          You can now login with the new password you just created!
        </p>
        <div className="w-full grid gap-4">
          <Button
            as={Link}
            href={"/login"}
            color="primary"
            className={"w-full flex-1"}
          >
            Login
          </Button>
        </div>
      </div>
    </>
  );
}
