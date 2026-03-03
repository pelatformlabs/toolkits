import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "pelatform-ui";
import { SatoshiFontCSS } from "pelatform-ui/components";

import "@/styles/globals.css";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", GeistSans.variable, GeistMono.variable)}
      suppressHydrationWarning
    >
      <head>
        <SatoshiFontCSS />
      </head>
      <body className="flex h-full bg-background font-sans text-base text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
