"use client";
import { cn } from "@/lib/utils";
import { Image, Link } from "@heroui/react";
import { motion } from "framer-motion";
import { Button } from "./button";

type EmptyStateProps = {
  title?: string;
  description?: string;
  src?: string;
  width?: number;
  height?: number;
  className?: string;
  classNames?: {
    base?: string;
    image?: string;
    heading?: string;
    paragraph?: string;
    button?: string;
  };
  handleAction?: () => void;
  buttonText?: string;
  component?: React.ReactNode;
  href?: string;
};

const EmptyState = ({
  title = "Nothing here",
  description = "Looks like you have no listings yet",
  src = "/images/svg/empty.svg",
  width,
  height,
  className,
  classNames,
  handleAction,
  buttonText,
  component,
  href,
}: EmptyStateProps) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 80 },
        show: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -80 },
      }}
      className={cn(
        `flex w-full flex-col items-center justify-center gap-1`,
        className,
        classNames?.base,
      )}
    >
      {component ? (
        component
      ) : (
        <Image
          src={src}
          alt="empty list"
          className={cn("w-[250px] dark:opacity-40", classNames?.image)}
          width={width || 200}
          height={height || 200}
        />
      )}
      <h4
        className={cn(
          "text-center text-lg leading-6 text-foreground font-semibold",
          classNames?.heading,
        )}
      >
        {title}
      </h4>
      <p
        className={cn(
          "mb-2 text-center text-sm leading-6 text-slate-500 max-w-96",
          classNames?.paragraph,
        )}
      >
        {description}
      </p>

      {(handleAction || href) && (
        <Button
          as={href ? Link : undefined}
          href={href ? href : undefined}
          onClick={!href ? handleAction : undefined}
          className={cn("w-full max-w-96", classNames?.button)}
        >
          {buttonText}
        </Button>
      )}
    </motion.div>
  );
};
export default EmptyState;
