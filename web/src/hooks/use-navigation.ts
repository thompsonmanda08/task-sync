"use client";
import { usePathname, useRouter } from "next/navigation";

const useNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();

  const pathArr = pathname?.split("/");
  const currentPath = pathArr[1];
  const dashboardRoute = `/dashboard`;
  const isDashboardRoute = pathname?.startsWith(dashboardRoute);

  const isAuthPage = [
    "login",
    "register",
    "support",
    "reset-password",
  ].includes(currentPath);

  return {
    pathname,
    router,
    pathArr,
    isAuthPage,
    currentPath,
    dashboardRoute,
    isDashboardRoute,
  };
};

export default useNavigation;
