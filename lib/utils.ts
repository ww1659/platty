import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
} from "date-fns";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export function formatDate(dateInput: Date) {
  const formattedDate = format(new Date(dateInput), "EEE, dd MMM, HH:mm");
  return formattedDate;
}

export function formatDateShort(dateInput: Date) {
  const formattedDate = format(new Date(dateInput), "EEE, dd MMM");
  return formattedDate;
}

export function formatDateTimeOnly(dateInput: Date) {
  const formattedDate = format(new Date(dateInput), "HH:mm");
  return formattedDate;
}

export function formatDateLong(dateInput: Date) {
  const date = new Date(dateInput);
  return format(date, `EEEE, dd MMMM, yyyy, h:mm a`);
}

export function getYear(dateInput: Date) {
  const year = dateInput.getFullYear();
  return year;
}

export function formatTime(dateInput: Date) {
  const time = format(new Date(dateInput), "HH:mm");
  return time;
}

export function calculateDuration(start: Date, end: Date) {
  const days = differenceInDays(end, start);
  const hours = differenceInHours(end, start) % 24;
  const minutes = differenceInMinutes(end, start) % 60;
  const seconds = differenceInSeconds(end, start) % 60;

  return { days, hours, minutes, seconds };
}

export function capitaliseFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Function to refresh access token using refresh token
export const refreshAccessToken = async (
  refreshToken: string | null | undefined
) => {
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });

    console.log(response, "REFRESH RESPONSE");

    const newAccessToken = response.data.access_token;
    window.localStorage.setItem("oauth_provider_token", newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw new Error("Failed to refresh access token");
  }
};

// Function to check if token is valid
export const validateAccessToken = async (token: string | null | undefined) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
    );
    console.log(response, "VALIDATE RESPONSE");
    return response.status === 200;
  } catch {
    return false;
  }
};
