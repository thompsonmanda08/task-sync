import localFont from "next/font/local";
import "../styles/globals.css";
import { cn } from "@/lib/utils";
import Providers from "./providers";
import { getAuthSession } from "./_actions/config-actions";
import React, { PropsWithChildren } from "react";

const fontSans = localFont({
  src: "./fonts/plus-jakarta-sans-variable-font_wght.ttf",
  variable: "--font-sans",
  weight: "100 900",
});

export const metadata = {
  title: "TaskSync",
  description:
    "Todo App",
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const { isAuthenticated } = await getAuthSession();

  return (
    <html
      lang="en"
      className={cn("h-screen scroll-smooth bg-background antialiased light")}
    >
      <head>
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${fontSans.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
