import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function timeAgo(date) {
  const now = new Date();
  const diff = (date - now) / 1000; // difference in seconds

  const units = [
    { max: 60, value: 1, name: "second" },
    { max: 3600, value: 60, name: "minute" },
    { max: 86400, value: 3600, name: "hour" },
    { max: 604800, value: 86400, name: "day" },
    { max: 2629800, value: 604800, name: "week" },
    { max: 31557600, value: 2629800, name: "month" },
    { max: Infinity, value: 31557600, name: "year" }
  ];

  const diffAbs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const unit of units) {
    if (diffAbs < unit.max) {
      const rounded = Math.round(diff / unit.value);
      return rtf.format(rounded, unit.name);
    }
  }
}
