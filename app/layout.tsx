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
    // The Boxii script scroll-locks the page by styling <html>/<body> before
    // hydration, so don't let React diff attributes on those two elements.
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        {/* Boxii overlay, served from the Lawbrokr CDN. React hoists this
            async script into the document <head>. */}
        <script
          async
          src="https://cdn.lawbrokr.com/js/latest/boxii.min.js"
          data-site-id="laiturner"
        />
      </body>
    </html>
  );
}
