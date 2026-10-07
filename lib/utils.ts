export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** "1" → "01" */
export const pad = (n: number, width = 2) => String(n).padStart(width, "0");

export const isExternal = (href: string) => /^https?:\/\//.test(href);

/** Readable form of a URL for display: "github.com/wifimoneydev/meetingbot". */
export const prettyUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
