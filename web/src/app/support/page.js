import React from "react";
import AuthLayout from "../(auth)/layout";
import { Logo } from "@/components/base";
import { ContactForm } from "@/components/forms";

async function Support() {
  return (
    <AuthLayout>
      <div className="grid place-items-center w-full h-full">
        <div className="w-full max-w-sm xl:max-w-md px-1">
          <div className="flex flex-col gap-y-3 w-full mb-8">
            <div className="flex md:hidden max-h-12 justify-start">
              <Logo
                className="object-contain scale-80"
                width={100}
                height={60}
                alt="TaskSync Logo"
                href="/"
              />
            </div>
            <h2 className="text-primary uppercase font-medium">
              Need help with something?
            </h2>
            <h3 className="text-slate-900 text-[clamp(16px,16px+1vw,48px)]  font-bold leading-8 my-1">
              Contact Support
            </h3>
          </div>
          <div className="flex justify-center items-center w-full ">
            <ContactForm />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Support;
