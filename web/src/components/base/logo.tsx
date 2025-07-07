"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import Link from "next/link";
type LogoProps = {
  href?: string;
  src?: string;
  alt?: string;
  isWhite?: boolean;
  isDark?: boolean;
  className?: string;
  isIcon?: boolean;
  width?: number;
  height?: number;
};

function Logo({
  href = "/",
  src,
  alt,
  isWhite = false,
  isDark = false,
  className = "",
  isIcon = false,
  width,
  height,
}: LogoProps) {
  const { theme } = useTheme();
  const [logoUrl, setLogoUrl] = useState("/images/logo/logo-light.svg");

  useEffect(() => {
    let logoType;

    if (isIcon) {
      logoType =
        theme === "light"
          ? `/images/logo/logo-icon-dark.svg`
          : "/images/logo/logo-icon-light.svg";
    } else if (isWhite) {
      logoType = "/images/logo/logo-light.svg";
    } else if (isDark) {
      logoType = `/images/logo/logo-dark.svg`;
    } else {
      logoType =
        theme === "light"
          ? `/images/logo/logo-dark.svg`
          : "/images/logo/logo-light.svg";
    }

    setLogoUrl(logoType);
  }, [theme, isIcon, isWhite, isDark]);

  // RENDERER
  if (isIcon) {
    return (
      <Link href={href}>
        <div
          className={cn(
            `aspect-square flex justify-center w-full max-h-[48px] items-center min-w-fit`,
            className,
            {
              "max-w-[42px] mx-auto max-h-[48px] ": isIcon,
            },
          )}
        >
          <Image
            className="object-contain aspect-square"
            src={src || logoUrl}
            width={width || 50}
            height={height || 50}
            alt={alt || "logo"}
            unoptimized
            priority
          />
        </div>
      </Link>
    );
  } else {
    return (
      <Link href={href}>
        <div className={cn(`w-full min-w-fit`, className)}>
          <Image
            className="object-contain transition-all duration-300 ease-in-out"
            src={src || logoUrl}
            width={width || 160}
            height={height || 50}
            alt={alt || "logo"}
            unoptimized
            priority
          />
        </div>
      </Link>
    );
  }
}

export default Logo;
