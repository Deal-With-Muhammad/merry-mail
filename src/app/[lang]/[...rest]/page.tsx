import { notFound } from "next/navigation";

// Unknown URLs under a locale render the localized not-found page.
export const instant = false;

export default function CatchAll() {
  notFound();
}
