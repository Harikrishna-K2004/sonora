
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SONORA | Your Music Universe",
  description: "Discover and experience your music universe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
