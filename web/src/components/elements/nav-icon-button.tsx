"use client";
import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

function NavIconButton({
  className,
  onClick,
  children,
}: PropsWithChildren & { className?: string; onClick?: (e?: any) => void }) {
  return (
    <button
      type="button"
      className={cn(
        "cursor-pointer p-1 rounded-lg hover:text-primary text-slate-400 dark:text-slate-200 dark:bg-primary/80 bg-secondary/10 text-secondary/50 dark:text-primary-foreground transition-all duration-300 ease-in-out hover:opacity-90 hover:scale-[0.99] max-w-8 max-h-8 aspect-square",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default NavIconButton;
