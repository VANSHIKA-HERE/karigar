import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "../styles/globals.css";
import { ReactQueryProvider } from "@/components/query-provider";
import { SiteLayout } from "@/components/site-layout";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Karigar",
  description: "India-first platform for local skilled workers",
  metadataBase: new URL("http://localhost:3000")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
  lang="en"
  suppressHydrationWarning
  className={`${inter.variable} ${poppins.variable}`}
>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-950 antialiased dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>
          <ReactQueryProvider>
            <SiteLayout>{children}</SiteLayout>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
