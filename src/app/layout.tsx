import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { brand } from "@/config/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: brand.name,
  description: brand.tagline,
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={GeistSans.variable}>
      <head>
        <style>{`:root{--brand:${brand.colors.light}}.dark{--brand:${brand.colors.dark}}`}</style>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}