"use client";

import Navbar from "./components/Navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen">
          {/* Nav Bar */}
          <Navbar />

          {/* Page Content */}
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
