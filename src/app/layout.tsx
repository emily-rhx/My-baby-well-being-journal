import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Baby Well-Being Insights",
  description: "Track the little things. See the bigger picture. The private digital companion to My Baby Well-Being Journal.",
  applicationName: "My Baby Well-Being Insights",
  appleWebApp: {
    capable: true,
    title: "Baby Well-Being",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#fbf7f0",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
