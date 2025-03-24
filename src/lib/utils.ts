import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

//TEST

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
