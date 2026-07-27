import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL(
    "https://querymend.com",
  ),
  title: {
    default:
      "QueryMend — AI-powered SQL code review",
    template: "%s | QueryMend",
  },
  description:
    "Review SQL with structured feedback on correctness, readability, maintainability, and potential performance risks.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "QueryMend",
    title:
      "QueryMend — AI-powered SQL code review",
    description:
      "Review SQL with structured feedback on correctness, readability, maintainability, and potential performance risks.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
