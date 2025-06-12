"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { cn } from "@/lib/utils";

function PoweredByInterwebb({ className }: { className?: string }) {
  const blackLogo = "/images/interwebb_black.svg";
  const whiteLogo = "/images/interwebb.svg";

  const [logoUrl, setLogoUrl] = useState(blackLogo);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const logoType = theme !== "light" ? whiteLogo : blackLogo;

    setLogoUrl(logoType);
  }, [theme]);

  return (
    <div
      className={cn(
        "inline-flex items-center w-full max-w-60 mx-auto h-12 aspect-video font-medium max-h-11 text-xs italic py-2 gap-2",
        className,
      )}
    >
      Powered by{" "}
      <Link
        className="inline-flex hover:text-sky-400 h-full"
        href={"https://inter-webb.com"}
        target="_blank"
      >
        <Image
          src={logoUrl}
          width={100}
          height={32}
          alt="Interwebb"
          className="object-contain"
        />
        ®
      </Link>
    </div>
  );
}

export default PoweredByInterwebb;
