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

export function formatDateShort(dateInput: Date) {
  const formattedDate = format(new Date(dateInput), "EEE dd MMM");
  return formattedDate;
}

export function getYear(dateInput: Date) {
  const year = dateInput.getFullYear();
  return year;
}

export function formatTime(dateInput: Date) {
  const time = format(new Date(dateInput), "HH:mm");
  return time;
}
