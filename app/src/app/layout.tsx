"use client";

import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import { secondaryFont } from "@/fonts";
import Header from "@/components/Home/header";
import store from "@/redux/store";
import { Provider } from "react-redux";
import RouterProvider from "@/providers/RouterProvider";

const metadata: Metadata = {
  title: "AiCruit",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`flex flex-col overflow-y-auto ${secondaryFont.className}`}
      >
        <Provider store={store}>
          <RouterProvider>
            <TanstackQueryProvider>
              <Header />
              <section className="flex-1 overflow-y-auto">
                <div className="container h-full">{children}</div>
              </section>
              <Toaster richColors closeButton />
            </TanstackQueryProvider>
          </RouterProvider>
        </Provider>
      </body>
    </html>
  );
}
