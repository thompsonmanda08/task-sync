"use client";
import { FaceBookIcon, InstagramIcon, TwitterXIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const SOCIAL_LINKS: { name: string; href: string; icon: any }[] = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61562737140803",
    icon: FaceBookIcon,
  },
  // {
  //   name: "Twitter",
  //   href: "https://x.com/zambiaembassytr",
  //   icon: TwitterXIcon,
  // },
  // {
  //   name: "LinkedIn",
  //   href: "https://www.linkedin.com/company/zambiaturkey/",
  //   icon: FaLinkedin,
  // },
  {
    name: "Instagram",
    href: "https://www.instagram.com/karibu_space/ ",
    icon: InstagramIcon,
  },
];

type SocialIconProps = {
  allowFloat?: boolean;
  className?: string;
  classNames?: {
    wrapper?: string;
    icon?: string;
  };
};

export default function SocialIcons({
  allowFloat = false,
  className,
  classNames,
}: SocialIconProps) {
  return (
    <div className={cn("flex gap-6", className, classNames?.wrapper)}>
      {SOCIAL_LINKS.map((item) => {
        return (
          <Link
            href={item.href}
            key={item.name}
            target="_blank"
            rel="noopener noreferrer"
          >
            <item.icon
              className={cn(
                "text-foreground/60 w-6 h-6 hover:text-foreground/80 transition-all duration-300 ease-in-out",
                {
                  "hover:-translate-y-1": allowFloat,
                },
                classNames?.icon,
              )}
            />
          </Link>
        );
      })}
    </div>
  );
}
