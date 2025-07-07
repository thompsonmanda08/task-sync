"use client";
import { Logo } from "@/components/base";
import { Image } from "@heroui/react";
import { PropsWithChildren } from "react";


function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex w-full h-[100svh] max-h-screen justify-center items-center overflow-clip">
      {/* IMAGE CONTAINER */}
      <div className="hidden md:flex flex-col flex-1 h-full justify-center items-center bg-secondary">
        <div className="flex flex-col justify-center h-full items-center relative">
          <div className="flex mt-10 max-w-sm w-full max-h-12 px-5 lg:px-0">
            <Logo
              className="object-contain"
              width={160}
              height={48}
              alt="TaskSync Logo"
              href="/"
              isWhite={true}
            />
          </div>

          <div className="aspect-square justify-center">
            <Image
              width={800}
              src={"/images/auth.png"}
              height={480}
              alt="TaskSync house"
              className={"w-full object-contain p-4"}
            />
          </div>

          <div className="mt-auto mb-20 mx-auto flex flex-col gap-6">
            <h2
              className={`font-bold text-center heading-3 text-primary-foreground max-w-max md:max-w-md mx-auto`}
            >
              Track & Collaborate
            </h2>
            <p
              className={`text-center paragraph-text font-medium max-w-lg mx-auto`}
            >
              Handle all your tasks in one place. 
            </p>
          </div>
        </div>
      </div>
      {/* FORM CONTAINER */}
      <div className="flex flex-col w-full md:flex-[1.5] h-full p-10 relative">
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
