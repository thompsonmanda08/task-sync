"use client";
import { useState } from "react";

export default function useCustomTabsHook(tabs: React.ReactNode[]) {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function navigateTo(tabIndex: number) {
    setIsLoading(true);
    try {
      setCurrentTabIndex(Number(tabIndex || 0));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  function navigateForward() {
    setCurrentTabIndex((i) => {
      if (i >= tabs.length - 1) return i;
      return i + 1;
    });
  }

  function navigateBackwards() {
    setCurrentTabIndex((i) => {
      if (i <= 0) return 0;
      return i - 1;
    });
  }

  const lastTab = tabs.length - 1;
  const firstTab = 0;
  const isFirstTab = currentTabIndex == firstTab;
  const isLastTab = currentTabIndex == lastTab;
  return {
    lastTab,
    firstTab,
    isFirstTab,
    isLastTab,
    currentTabIndex,
    activeTab: tabs[currentTabIndex],
    tabs,
    navigateTo,
    isLoading,
    setIsLoading,
    navigateForward,
    navigateBackwards,
  };
}
