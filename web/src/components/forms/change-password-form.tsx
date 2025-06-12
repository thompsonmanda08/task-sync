"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/utils";
import { Input } from "../ui/input";
import { resetPassword } from "@/app/_actions/auth-actions";

const PASSWORD_INIT = {
  currentPassword: "",
  password: "",
  confirmPassword: "",
};

const slideDownInView = {
  hidden: {
    opacity: 0,
    y: -100,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

function ChangePasswordFields({ changePassword, setChangePassword }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState(PASSWORD_INIT);
  const [confirmPassword, setConfirmPassword] = useState("");

  function updateFormData(fields) {
    setFormData((prev) => ({
      ...prev,
      ...fields,
    }));
  }

  const errors = [];

  if (formData.password.length < 4) {
    errors.push("Password must be 4 characters or more.");
  }
  if ((formData.password.match(/[A-Z]/g) || []).length < 1) {
    errors.push("Password must include at least 1 upper case letter");
  }

  if ((formData.password.match(/[^a-z]/gi) || []).length < 1) {
    errors.push("Password must include at least 1 symbol.");
  }

  const isInvalidPassword = errors.length > 0 && formData.password.length > 0;
  const passMatchErr =
    confirmPassword.length > 0 && confirmPassword !== formData.password;

  const handleChangePassword = async () => {
    setIsLoading(true);
    const response = await resetPassword({
      newPassword: formData.password,
    });

    if (response.success) {
      notify({
        title: "Success",
        description: "Password Changed successfully",
      });
      setChangePassword(false);
    } else {
      notify({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
    }

    setFormData(PASSWORD_INIT);
    setIsLoading(false);
  };

  return (
    changePassword && (
      <AnimatePresence mode="wait">
        <motion.div
          variants={slideDownInView}
          initial={"hidden"}
          animate={"visible"}
          exit={"hidden"}
          className="flex flex-col gap-4 w-full py-4 max-w-lg"
        >
          <>
            {/* <Input
              id="old_password"
              name="old-password"
              label="Current Password"
              type="password"
              required={true}
              value={formData?.currentPassword}
              onChange={(e) =>
                updateFormData({ currentPassword: e.target.value })
              }
            /> */}
            <Input
              label={"New Password"}
              required={true}
              isInvalid={isInvalidPassword}
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
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Your password must include letters numbers and symbols!"
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
          </>

          <div className="mt-2 flex justify-end gap-2">
            <Button
              color="danger"
              disabled={isLoading}
              onClick={
                setChangePassword ? () => setChangePassword(false) : undefined
              }
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading || isInvalidPassword || passMatchErr}
              onClick={handleChangePassword}
            >
              Save
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  );
}

export default ChangePasswordFields;
