import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const ik_url = import.meta.env.VITE_API_IK_URL_ENDPOINT

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getImageUrl = (media: string) => {
  if(media.startsWith("blob:") || media.startsWith("data:")) {
    return media;
  }
  return `${ik_url}/${media}`;
}