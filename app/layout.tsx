import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Button } from "@/components/ui/button";
import { Inter } from "next/font/google";
import Footer from "@/components/footer";

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
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={`${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header>{/* header */}</header>
            <main>{children}</main>
            <footer>
              <Footer />
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
