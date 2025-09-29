import Footer from "@/components/footer";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Particles } from "@/components/ui/particles";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

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
    <ClerkProvider
      appearance={{
        baseTheme: [dark],
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={`${roboto.variable}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative min-h-screen">
              <Particles
                className="fixed inset-0 z-0 pointer-events-none"
                quantity={300}
                ease={80}
                color="#3b82f6"
                refresh={false}
              />
              <div className="relative z-10">
                <header>
                  <Header />
                </header>
                <main>{children}</main>
                <footer>
                  <Footer />
                </footer>
              </div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
