"use client";
import React from "react";
import { getUserInitials } from "@/lib/utils";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link as NextUILink,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  useDisclosure,
  cn,
  Switch,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";

import { Logo } from "../base";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  LayoutDashboardIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  WalletIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import useNavigation from "@/hooks/use-navigation";
import useAccountStore from "@/context/user-account-store";
import useNavigationStore from "@/context/navigation-store";
import { User } from "@/types/auth";
import { useUserProfile } from "@/hooks/use-query-hooks";


export default function TopNavbar({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {data: ProfileResponse } = useUserProfile(isAuthenticated)
  const user = ProfileResponse?.data as User

  const { isAuthPage, pathname, isDashboardRoute, currentPath } =
    useNavigation();
  const { toggleSideNav } = useNavigationStore((state) => state);

  const navBarItems = [
    {
      name: "Property",
      href: "/listings?",
    },
    {
      name: "Rent",
      href: "/listings?for_Rent=true",
    },
    {
      name: "Buy",
      href: "/listings?for_Sale=true",
    },

    {
      name: "Bookings",
      href: "/bookings",
    },
    {
      name: "Agencies",
      href: "/agencies",
    },
    {
      name: "Support",
      href: "/#contact-us",
    },
  ];

  const subMenuItems = isAuthenticated
    ? [
        {
          name: "Account Settings",
          href: "/dashboard/profile",
        },
        {
          name: "Support",
          href: "/support",
        },
        {
          name: "Log Out",
          href: "/logout",
        },
      ]
    : [
        {
          name: "Login",
          href: "/login",
        },
        {
          name: "Register",
          href: "/register",
        },
      ];

  const menuItems = [...navBarItems, ...subMenuItems];

  const isActive = (href: string) =>
    pathname == href || pathname.startsWith(href);

  const balance =
    user?.wallet &&
    typeof user.wallet === "object" &&
    user.wallet !== null &&
    "credits" in user.wallet
      ? (user.wallet as { credits?: number }).credits
      : undefined;

  if (isAuthPage) return null;

  return (
    <>
      {/* IF NOT A DASHBOARD ROUTE */}
      {!isDashboardRoute && (
        <Navbar
          isBordered
          shouldHideOnScroll
          isMenuOpen={isMenuOpen}
          onMenuOpenChange={setIsMenuOpen}
          classNames={{
            wrapper: "max-w-[1440px] container mx-auto",
          }}
        >
          <NavbarContent>
            <NavbarMenuToggle
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="lg:hidden"
            />
            <NavbarBrand>
              <Logo />
              <span className="sr-only font-bold text-inherit">
                taskSync Logo
              </span>
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent className="hidden gap-6 lg:flex" justify="center">
            {navBarItems.map((item) => {
              return (
                <NavbarItem key={item.name} isActive={isActive(item.href)}>
                  <NextUILink
                    href={item.href}
                    className="font-medium"
                    aria-label={item.name}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    color={isActive(item.href) ? "primary" : "foreground"}
                  >
                    {item.name}
                  </NextUILink>
                </NavbarItem>
              );
            })}
          </NavbarContent>

          {isAuthenticated ? (
            <NavbarContent as="div" justify="end">
              <NextUILink
                href={"/dashboard/account?main=profile&tab=kredits"}
                className={cn(
                  "lg:mr-4 flex group cursor-pointer items-start gap-2 text-foreground-600",
                )}
              >
                <WalletBalance balance={balance ?? 0} />
              </NextUILink>

              <Button as={NextUILink} href="/dashboard" isIconOnly className={"h-9 w-9 bg-primary"}>
                <LayoutDashboardIcon className="h-5 w-5 text-white" />
              </Button>

              <AvatarDropDown user={user} />
            </NavbarContent>
          ) : (
            <NavbarContent justify="end">
              <NavbarItem className="hidden lg:flex">
                <Button
                  as={Link}
                  variant="bordered"
                  href="/register"
                >
                  Register
                </Button>
              </NavbarItem>
              <NavbarItem>
                <Button as={Link} color="primary" href="/login">
                  Login
                </Button>
              </NavbarItem>
            </NavbarContent>
          )}

          <NavbarMenu>
            {menuItems.map((item, index) => (
              <NavbarMenuItem key={`${item.href}-${index}`}>
                <Button
                  as={Link}
                  // variant="faded"
                  // isActive={isActive(item.href)}
                  color={
                    isActive(item.href)
                      ? "primary"
                      : index === menuItems?.length - 1 && isAuthenticated
                        ? "danger"
                        : "default"
                  }
                  className={cn("w-full", {
                    "bg-primary text-white": isActive(item.href),
                  })}
                  href={item.href}
              
                >
                  {item.name}
                </Button>
              </NavbarMenuItem>
            ))}
          </NavbarMenu>
        </Navbar>
      )}

      {}
      {/* IF DASHBOARD ROUTE */}
      {isDashboardRoute && (
        <nav
          className={cn(
            `fixed left-0 z-20 right-0 flex w-full items-center shadow-md light:bg-background/60 py-3 pr-5 sm:shadow-sm backdrop-blur-md transition-all md:pl-2 lg:top-0 lg:justify-start lg:shadow-none bg-background/80 border-b border-foreground/10`,
          )}
        >
          <div className="flex w-full items-center px-5">
            <div className="transition-all duration-300 ease-in-out flex lg:translate-x-[300px]">
              <Button
                isIconOnly
                variant="light"
                className=" z-30 absolute left-4 top-2 cursor-pointer lg:hidden"
                onPress={toggleSideNav}
              >
                <MenuIcon className="w-6 h-6cursor-pointer" />
              </Button>
              <h2
                className={cn(
                  "ml-10 lg:ml-0 font-bold capitalize lg:leading-8 text-foreground md:text-xl",
                )}
              >
                {currentPath}
              </h2>
            </div>
            <div className="relative z-50 ml-auto flex items-center justify-center rounded-full">
              <div className="flex gap-3 mx-4">
                <WalletBalance balance={balance ?? 0} />
              </div>
              <div className={cn("flex items-center gap-2 text-gray-400", {})}>
                <AvatarDropDown user={user} />
              </div>
            </div>
          </div>
        </nav>
      )}

      <LogOutPrompt
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
      />
    </>
  );
}

export function AvatarDropDown({ user }: { user: Partial<User> }) {
  const { logUserOut } = useAccountStore((state) => state);
  const { theme, setTheme } = useTheme();
  const [isSelectedTheme, setIsSelectedTheme] = React.useState(
    theme == "dark" ? true : false,
  );

  const userFullName = `${user?.firstName} ${user?.lastName}`;
  const userInitials = getUserInitials(userFullName);

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          radius="sm"
          showFallback
          as="button"
          className="transition-transform"
          color="primary"
          name={userInitials}
          size="sm"
          src={String(user?.profilePicture)}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem
          key="profile"
          href="/dashboard/account"
          className="h-18 gap-2"
        >
          <p className="font-semibold">
            <span className="text-xs text-foreground/50">Signed in as </span>{" "}
            <br />
            {userFullName}
          </p>
          <p className="text-xs text-foreground/70">{user?.email}</p>
        </DropdownItem>
        <DropdownItem key="dashboard">
          <Link href="/dashboard">My Dashboard</Link>
        </DropdownItem>
        <DropdownItem key="account">
          <Link href="/profile">Account Profile</Link>
        </DropdownItem>
        <DropdownItem key="settings">
          <Link href="/settings">Settings</Link>
        </DropdownItem>

        <DropdownItem
          isReadOnly
          key="theme"
          className="flex cursor-default justify-between"
        >
          <div className="flex w-full cursor-default items-center justify-between">
            <span>Dark Mode</span>
            {/* <ThemeSwitcher /> */}
            <Switch
              defaultSelected
              isSelected={isSelectedTheme}
              onValueChange={(value) => {
                setIsSelectedTheme(value);
                setTheme(value ? "dark" : "light");
              }}
              size="md"
              color="primary"
              startContent={<SunIcon />}
              endContent={<MoonIcon />}
            >
              {/* Dark mode */}
            </Switch>
          </div>
        </DropdownItem>
        <DropdownItem key="help_and_feedback">
          <Link href="/support">Help & Feedback</Link>
        </DropdownItem>
        <DropdownItem key="logout" color="danger">
          <Button
            size="md"
            variant="flat"
            color="danger"
            className="flex h-full w-full flex-1 items-start justify-start bg-transparent pl-0 pr-2 font-medium hover:bg-transparent"
            onPress={logUserOut}
          >
            Log Out
          </Button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export function WalletBalance({ balance }: { balance: number }) {
  return (
    <>
      <Button isIconOnly className={"h-9 w-9 "}>
        <WalletIcon className="h-5 w-5 text-white" />
      </Button>
      <div className="sm:flex hidden flex-col items-start gap-1 text-xs lg:text-sm ">
        <span className={cn("leading-4 tracking-wide")}>Balance</span>
        <span className={cn("lg:-mt-1 font-bold text-primary")}>
          {balance ?? 0} {balance > 1 ? "Kredits" : "Kredit"}
        </span>
      </div>
    </>
  );
}

export function LogOutPrompt({
  isOpen,
  onOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const { logUserOut } = useAccountStore((state) => state);
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log Out</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to log out?</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  aria-label="button"
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  aria-label="button"
                  color="primary"
                  onPress={async () => {
                    await logUserOut();
                    onClose();
                  }}
                >
                  Log Out
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
