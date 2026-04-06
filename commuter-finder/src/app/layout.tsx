import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "London Commuter Finder — Adam & Simon",
  description: "Find the perfect London commuter town",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
