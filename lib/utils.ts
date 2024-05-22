import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateInput: Date) {
  const formattedDate = format(new Date(dateInput), "EEE, dd MMM, HH:mm");
  return formattedDate;
}
