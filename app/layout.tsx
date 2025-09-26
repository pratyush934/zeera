import Footer from "@/components/footer";
import Header from "@/components/header";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import {ClerkProvider} from '@clerk/nextjs';
import "./globals.css"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zeera",
  description: "Project Management App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={`${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header>
              <Header />
            </header>
            <main>{children}</main>
            <footer>
              <Footer />
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
