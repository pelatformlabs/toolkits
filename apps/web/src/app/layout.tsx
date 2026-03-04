import { cn } from "pelatform-ui/utils";
import { fontVariables } from "@/lib/fonts";

import "@/styles/globals.css";

import { baseUrl, createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: {
    template: "%s | Pelatform Toolkits",
    default: "Pelatform Toolkits",
  },
  description: "Documentation for Pelatform toolkits.",
  metadataBase: baseUrl,
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn(fontVariables, "overscroll-none")} suppressHydrationWarning>
      <body className="style-vega flex h-full flex-col bg-background font-sans text-base text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
