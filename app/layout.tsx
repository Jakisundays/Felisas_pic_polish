import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Prendas by Felicity | Joyería de Folklore Panameño",
    template: "%s | Prendas by Felicity",
  },
  description:
    "Joyería para amantes del Folklore Panameño. Encuentra piezas únicas que celebran la tradición y la cultura de Panamá.",
  applicationName: "Prendas by Felicity",
  authors: [
    {
      name: "Felisa",
      url: "https://www.instagram.com/prendasbyfelicity",
    },
  ],
  generator: "Instagram",
  keywords: [
    "Prendas by Felicity",
    "joyería",
    "folklore",
    "Panamá",
    "joyas",
    "cultura panameña",
  ],
  referrer: "origin",
  creator: "Prendas by Felicity",
  publisher: "Prendas by Felicity",
  robots: "index, follow",
  icons: {
    icon: "/favicon_io/favicon.ico", // Replace with actual path if needed
    apple: "/favicon_io/apple-touch-icon.png", // Replace with actual path if needed
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
        {children}
      </body>
    </html>
  );
}
