import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oklahoma City Family, Criminal Defense, & Immigration Lawyers",
  description:
    "Lai & Turner Law Firm PLLC — Top-reviewed Criminal Defense, Immigration, and Family Law attorneys serving Oklahoma City.",
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
