import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Math Vibe - Nauka matematyki dla dzieci",
  description: "Zabawna aplikacja do nauki matematyki dla dzieci w wieku szkolnym",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Math Vibe",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${nunito.variable} font-sans antialiased bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 h-[100dvh] overflow-hidden overscroll-none`}
      >
        <Providers>
          <div className="flex flex-col h-full w-full">
            {children}
          </div>
        </Providers>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
