import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { DogRouteLoader } from "@/components/ui/dog-route-loader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dog Costume Contest",
  description:
    "Register your dog, browse contestants, and vote in the Fur-right Night awards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} event-bg min-h-screen antialiased`}
        suppressHydrationWarning
      >
        {children}
        <DogRouteLoader />
      </body>
    </html>
  );
}
