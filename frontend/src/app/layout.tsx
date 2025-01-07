import type { Metadata } from "next";
import "./globals.css";
import { secondaryFont } from "@/font";

export const metadata: Metadata = {
  title: "AiCruit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`h-screen flex flex-col overflow-y-auto ${secondaryFont.className}`}
      >
        <section className="flex-1 overflow-y-auto">
          <div className="container h-full">{children}</div>
        </section>
      </body>
    </html>
  );
}
