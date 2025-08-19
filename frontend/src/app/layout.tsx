import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from '@/components/providers/AuthProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { NotificationProvider, NotificationInitializer } from '@/components/ui/NotificationSystem'
import { AccessibilityProvider, AccessibilityStyles } from '@/components/providers/AccessibilityProvider'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { NetworkStatus } from '@/components/ui/LoadingStates'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jiko Milele ERP",
  description: "Modern Kenyan Restaurant Management System",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <AccessibilityProvider>
            <AccessibilityStyles />
            <QueryProvider>
              <NotificationProvider>
                <NotificationInitializer />
                <AuthProvider>
                  <NetworkStatus />
                  {children}
                </AuthProvider>
              </NotificationProvider>
            </QueryProvider>
          </AccessibilityProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
