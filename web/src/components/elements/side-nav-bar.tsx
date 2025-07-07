"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import useNavigationStore from "@/context/navigation-store";
import useAccountStore from "@/context/user-account-store";

import {
  ChartNoAxesCombined,
  ClipboardCheckIcon,
  FileText,
  FunctionSquare,
  HomeIcon,
  LayoutDashboard,
  Mail,
  MessageSquareWarning,
  NotebookPen,
  Store,
} from "lucide-react";
import { Logo } from "../base";
import useNavigation from "@/hooks/use-navigation";
import { Button } from "../ui/button";
import { UserIcon } from "@/lib/icons";

export const SIDE_BAR_OPTIONS = [
  {
    name: "Home",
    href: "/dashboard",
    Icon: LayoutDashboard,
  },
  {
    name: "Property",
    href: "/dashboard/property",
    Icon: HomeIcon,
  },
  {
    name: "Applications",
    href: "/dashboard/applications",
    Icon: FileText,
  },
  {
    name: "Bookings",
    href: "/dashboard/bookings",
    Icon: NotebookPen,
  },
  {
    name: "Rentals",
    href: "/dashboard/rentals",
    Icon: NotebookPen,
  },
  {
    name: "Financials",
    href: "/dashboard/financials",
    Icon: ChartNoAxesCombined,
  },
  {
    name: "Inbox",
    href: "/dashboard/inbox",
    Icon: Mail,
  },
  {
    name: "Issues",
    href: "/dashboard/issues",
    Icon: MessageSquareWarning,
  },
  {
    name: "Vendors",
    href: "/dashboard/vendors",
    Icon: Store,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    Icon: FunctionSquare,
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    Icon: ClipboardCheckIcon,
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    Icon: UserIcon,
  },
];

function SideNavBar({}) {
  const pathname = usePathname();
  const { logUserOut } = useAccountStore((state) => state);
  const { isSideNavOpen, toggleSideNav } = useNavigationStore((state) => state);

  function handleMenuItemClick() {
    if (isSideNavOpen) {
      toggleSideNav();
    }
  }

  return (
    <>
      <nav
        className={cn(
          `hidden lg:block px-4 pt-5 pb-10 transition-all min-w-[280px] w-full max-w-[300px] bg-secondary dark:bg-card text-white shadow-md shadow-slate-800/5 z-20 `,
        )}
      >
        <div className="flex flex-col w-full h-full">
          <div className="group flex items-center">
            <Logo alt="logo" />
          </div>
          {/* MENU ITEMS CONTAINER */}
          <div className="flex flex-col w-full h-full gap-2 mt-8">
            {SIDE_BAR_OPTIONS.map(({ name, href, Icon }, index) => {
              // Define the selected route on navigation
              const active =
                pathname.split("/")[2] == name.toLowerCase() ||
                pathname == href;

              return (
                <div key={index} className="flex flex-col">
                  {/* MAIN LINK */}
                  <Link
                    key={index}
                    href={href}
                    onClick={handleMenuItemClick}
                    className={cn(
                      `group flex bg-transparent text-white/70 hover:bg-primary/10 font-normal items-center cursor-pointer gap-2 p-2 rounded-xl text-sm max-h-14 flex-grow-0 relative`,
                      {
                        "bg-primary/10 text-white font-medium": active,
                      },
                    )}
                  >
                    <span
                      className={cn(
                        "bg-transparent group-hover:bg-primary/20 p-1 rounded-md",
                        {
                          "bg-primary hover:bg-primary group-hover:bg-primary  text-white":
                            active,
                        },
                      )}
                    >
                      <Icon className={cn("w-4 h-4")} />
                    </span>

                    {name}
                  </Link>
                </div>
              );
            })}
          </div>
          <button
            className={cn(
              `group mt-auto bg-primary/10 hover:bg-primary/20 hover:text-primary font-medium flex gap-3 cursor-pointer mb-2 p-3 rounded-lg items-center text-sm  transition-all duration-200 ease-in-out relative`,
            )}
            onClick={logUserOut}
          >
            <ArrowRightStartOnRectangleIcon className="w-6 h-6" />
            Logout
          </button>
        </div>
      </nav>

      {/* MOBILE SIDE NAVIGATION */}
      <MobileSideNavBar />
    </>
  );
}

export default SideNavBar;

export function MobileSideNavBar({}) {
  const { pathname } = useNavigation();
  const { logUserOut } = useAccountStore((state) => state);
  const { isSideNavOpen, toggleSideNav } = useNavigationStore((state) => state);

  return (
    <>
      {
        <motion.div
          whileInView={{ opacity: [0, 1] }}
          onClick={toggleSideNav}
          className={cn(
            `absolute hidden left-[-100%] bg-black/40 z-[10] backdrop-blur-sm`,
            {
              "block inset-0": isSideNavOpen,
            },
          )}
        />
      }
      <nav
        className={cn(
          `left-[-100%] flex-col w-[70%] max-w-[300px] min-w-[300px] h-full fixed top-0 bg-secondary transition-all duration-300 ease-in-out z-[999] p-5`,
          {
            "flex left-0": isSideNavOpen,
          },
        )}
      >
        <Button
          isIconOnly
          radius="full"
          className="p-2 max-w-fit absolute -right-16 mr-2 mt-1 hover:text-primary transition-all duration-200 ease-in-out text-secondary-foreground bg-primary/50 rounded-full"
          onPress={toggleSideNav}
        >
          <XMarkIcon className="w-6 h-6 " />
        </Button>
        <div className="flex flex-col w-full h-full">
          <Logo isWhite alt="logo" />

          {/* MENU ITEMS CONTAINER */}
          <div className="flex flex-col w-full h-full gap-4 mt-8">
            {SIDE_BAR_OPTIONS.map(({ name, href, Icon }, index) => {
              const active =
                pathname.split("/")[1] == name.toLowerCase() ||
                pathname == href;
              return (
                <Link
                  key={index}
                  href={href}
                  shallow={true}
                  onClick={() => toggleSideNav()}
                  className={cn(
                    `group bg-transparent hover:bg-accent/5 text-secondary-foreground/80
                  flex items-center cursor-pointer p-3 rounded-lg text-sm font-medium max-h-14 flex-grow-0 gap-2`,
                    {
                      "bg-primary/20 text-primary rounded-sm": active,
                    },
                  )}
                >
                  <span
                    className={cn(
                      "bg-transparent group-hover:bg-primary/20 p-2 rounded-md",
                      {
                        "bg-primary hover:bg-primary group-hover:bg-primary  text-white":
                          active,
                      },
                    )}
                  >
                    <Icon className={cn("w-6 h-6")} />
                  </span>
                  {name}
                </Link>
              );
            })}
          </div>

          <button
            className="mt-auto flex gap-3 cursor-pointer mb-4 p-3 rounded-lg items-center text-sm font-medium hover:bg-primary/10 text-secondary-foreground"
            onClick={() => {
              logUserOut();
              toggleSideNav();
            }}
          >
            <ArrowRightStartOnRectangleIcon className="w-6 h-6" />
            Log out
          </button>
        </div>
      </nav>
    </>
  );
}
