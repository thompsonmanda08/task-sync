"use client";
import { Button as NextUIButton } from "@heroui/react";
import { cn } from "@/lib/utils";

import type { ButtonProps as NextUIButtonProps } from "@heroui/react";

type ButtonHeroProps = NextUIButtonProps & {
  className?: string;
  loadingText?: React.ReactNode;
};

export function Button({
  children,
  loadingText,
  size = "md",
  radius = "sm",
  className,
  ...props
}: ButtonHeroProps) {
  props.variant ??= "solid";
  props.color ??= "primary";

  return (
    <NextUIButton
      radius={radius}
      size={size}
      className={cn("min-w-max ", className)}
      {...props}
    >
      {props.isLoading ? loadingText || "" : children}
    </NextUIButton>
  );
}
