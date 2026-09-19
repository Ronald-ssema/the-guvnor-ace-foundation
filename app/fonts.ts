import { Fraunces, Source_Sans_3 } from "next/font/google";

export const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const displayFont = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});
