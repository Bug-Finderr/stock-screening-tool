import ThemeSwitcher from "@/components/theme-switcher";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stock Screening Tool",
  description:
    "A web-based tool to filter and view stocks based on specific criteria.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.className} ${GeistMono.className} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <div className="flex min-h-screen flex-col">
              <Suspense fallback={null}>
                <header className="absolute right-4 top-4 md:relative md:right-auto md:top-auto md:flex md:justify-end md:p-4">
                  <ThemeSwitcher />
                </header>
                <main className="flex-grow">{children}</main>
                <footer className="p-4 text-center text-sm text-gray-500">
                  © {new Date().getFullYear()} Stock Screening Tool
                </footer>
              </Suspense>
            </div>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
