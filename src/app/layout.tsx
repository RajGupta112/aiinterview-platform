import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "sonner";
import ClientLayout from "@/components/components/ClientLayout";
import SessionProviderWrapper from "@/components/components/SessionProviderWrapper";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIVue - Master Your Interviews with AI",
  description:
    "Experience realistic AI-powered interviews and get feedback that helps you shine in the real one.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {/* ✅ Global Session Provider */}
        <SessionProviderWrapper session={null}>
          <ClientLayout>{children}</ClientLayout>
          <Toaster position="top-center" richColors closeButton />
          <Analytics />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
