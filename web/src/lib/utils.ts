// 'use client'
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// import { addToast,ToastProps } from "@heroui/react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}



export function formatCurrency(amount: number) {
  const currencyFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ZMW",
    minimumFractionDigits: 2,
  });
  return amount ? currencyFormat.format(amount) : "";
}

export function maskString(
  string: string,
  firstCharacters = 0,
  lastCharacters = 6,
) {
  if (string?.length < 10) {
    return string;
  }

  const first = string?.slice(0, firstCharacters);
  const last = string?.slice(string?.length - lastCharacters);
  return `${first} *****${last}`;
}

export function getUserInitials(name: string) {
  return name
    ?.split(" ")
    .map((i) => i[0])
    .join("");
}

export function capitalize(str = "") {
  return str?.toString()?.charAt(0)?.toUpperCase() + str?.toString()?.slice(1);
}

export function formatDate(inputDate: string, dateStyle = "") {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  const date = new Date(inputDate);

  const formattedDate = date?.toLocaleDateString("en", options);

  const [month, day, year] = formattedDate.split(" ");

  const YYYY = date.getFullYear();

  const MM = String(date.getMonth() + 1).padStart(2, "0");

  const DD = String(date.getDate()).padStart(2, "0");

  // Format the date as "YYYY-MM-DD"
  if (dateStyle === "YYYY-MM-DD") return `${YYYY}-${MM}-${DD}`;

  // Format the date as "DD-MM-YYYY"
  if (dateStyle === "DD-MM-YYYY") return `${DD}-${MM}-${YYYY}`;

  return `${parseInt(day)}-${month}-${year}`;
}
