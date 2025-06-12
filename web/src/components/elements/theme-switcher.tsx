"use client";

import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      isIconOnly
      className={className}
      onPress={() => (theme == "light" ? setTheme("dark") : setTheme("light"))}
    >
      {theme === "light" ? (
        <MoonIcon className="p-0.5 w-6 aspect-square" />
      ) : (
        <SunIcon className="p-0.5 w-6 aspect-square" />
      )}
    </Button>
  );
}

export default ThemeSwitcher;
