"use client";
import { notify } from "@/lib/utils";
import { Card, Textarea } from "@heroui/react";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

function SupportForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const mobileNumber = formData.get("MobileNumber")?.toString().trim();
    const fullName = formData.get("FullName")?.toString().trim();
    const email = formData.get("Email")?.toString().trim();
    const message = formData.get("Message")?.toString().trim();

    try {
      // const response = { ok: false };
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ ok: true });
        }, 3000);
      });

      if (response?.success) {
        e.currentTarget?.reset();
        notify({
          title: "Success",
          description: "Message sent successfully",
        });
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="">
        <form
          onSubmit={handleOnSubmit}
          className="mx-auto flex w-full max-w-md flex-col gap-4"
        >
          <Input
            label="Full Name"
            placeholder="Jonas Banda"
            name="FullName"
            required
          />

          <Input label="Mobile Number" name="MobileNumber" required />
          <Input label="Email Address" type="email" name="Email" required />
          <Textarea
            rows={4}
            label="Message"
            name="message"
            id="message"
            required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary/80 sm:text-sm sm:leading-6"
            defaultValue={""}
          />
          <Button
            isLoading={isLoading}
            isDisabled={isLoading}
            loadingText={"Sending..."}
            type="submit"
          >
            Send
          </Button>
        </form>
      </Card>
    </>
  );
}

export default SupportForm;
