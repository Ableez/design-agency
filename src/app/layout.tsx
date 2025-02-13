import "#/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ClerkProvider, GoogleOneTap } from "@clerk/nextjs";

import { TRPCReactProvider } from "#/trpc/react";
import { ThemeProvider } from "#/components/theme-provider";
import { Toaster } from "#/components/ui/sonner";
import { Toaster as ToastToaster } from "#/components/ui/toaster";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import AuthReminderDrawer from "#/components/auth/auth-reminder-drawer";

export const metadata: Metadata = {
  title: "Asterisk DA",
  description:
    "Asterisk Design Agency is a platform for you to manage your brand visual identity and design jobs.",
  icons: [{ rel: "icon", url: "/favicon.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html
        lang="en"
        className={`${GeistSans.variable}`}
        suppressHydrationWarning
        suppressContentEditableWarning
      >
        <body>
          <GoogleOneTap />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            <TRPCReactProvider>{children}</TRPCReactProvider>
            <Toaster position="top-center" />
            <ToastToaster />
            <AuthReminderDrawer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
