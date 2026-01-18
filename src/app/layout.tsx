import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navigation/navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "rabt - Connect Engineers with Business Owners",
  description: "Professional platform connecting talented engineers with innovative business projects. Find your perfect match for collaboration and growth.",
  keywords: ["engineering", "business", "projects", "collaboration", "freelance", "developers", "startups"],
  authors: [{ name: "rabt Platform" }],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "rabt - Connect Engineers with Business Owners",
    description: "Professional platform connecting talented engineers with innovative business projects.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "rabt - Connect Engineers with Business Owners",
    description: "Professional platform connecting talented engineers with innovative business projects.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <Navbar />
          <main className="pt-20">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
