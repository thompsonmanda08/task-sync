"use client";

import { cn, getUserInitials } from "@/lib/utils";
import { AvatarProps, Avatar as NextAvatar } from "@heroui/react";

type MyAvatarProps = AvatarProps & {
  showUserInfo?: boolean;
  showFallback?: boolean;
  subText?: string;
  classNames?: {
    avatar?: string;
    userInfoWrapper?: string;
    name?: string;
    subText?: string;
  };
};

function Avatar({
  name,
  src,
  subText,
  showUserInfo,
  showFallback = true,
  classNames,
  ...props
}: MyAvatarProps) {
  return (
    <div
      className="flex cursor-pointer items-center justify-start gap-2
							transition-all duration-200 ease-in-out"
    >
      <span className="sr-only">user avatar</span>
      <NextAvatar
        className={cn(
          "h-9 w-9 flex-none rounded-xl bg-secondary",
          classNames?.avatar,
        )}
        color={props?.color}
        src={src}
        alt={`Image - ${name}`}
        width={200}
        height={200}
        name={showFallback ? getUserInitials(name) : undefined}
        showFallback={showFallback}
        {...props}
      />

      {showUserInfo && (
        <div
          className={cn(
            "hidden 2xl:flex min-w-[120px] flex-col items-start gap-1",
            classNames?.userInfoWrapper,
          )}
        >
          <p
            className={cn(
              "text-sm font-semibold text-foreground-600",
              classNames?.name,
            )}
          >
            {name}
          </p>
          <p
            className={cn(
              "-mt-1 ml-0.5 text-sm font-medium text-foreground/50",
              classNames?.subText,
            )}
          >
            {subText}
          </p>
        </div>
      )}
    </div>
  );
}

export default Avatar;
