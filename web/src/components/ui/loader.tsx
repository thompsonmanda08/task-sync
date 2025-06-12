"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@heroui/react";

type LoaderProps = {
  size?: "sm" | "md" | "lg";
  scale?: number;
  loadingText?: string;
  color?:
    | "current"
    | "white"
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  className?: string;
  classNames?: {
    wrapper?: string;
    container?: string;
    spinner?: string;
    text?: string;
  };
  isLandscape?: boolean;
  removeWrapper?: boolean;
};

function Loader({
  size = "lg",
  scale = 1.25,
  loadingText,
  color,
  className,
  classNames,
  isLandscape,
  removeWrapper,
}: LoaderProps) {
  return (
    <div
      className={cn(
        "grid min-h-80 flex-1 flex-grow place-items-center rounded-xl bg-default-200/10 aspect-square py-8",
        classNames?.wrapper,
        { "shadow-none bg-transparent border-none": removeWrapper },
      )}
    >
      <div
        className={cn(
          "flex w-max flex-1 flex-col items-center justify-start gap-4",
          classNames?.container,
          className,
          { "flex-row": isLandscape },
        )}
      >
        <div>
          <Spinner
            className={cn(classNames?.spinner)}
            color={color}
            size={size}
            style={{
              scale,
            }}
          />
        </div>
        {loadingText && (
          <p
            className={cn(
              "mt-4 max-w-sm break-words font-bold text-foreground/70",
              classNames?.text,
            )}
          >
            {loadingText}
          </p>
        )}
      </div>
    </div>
  );
}

export default Loader;
