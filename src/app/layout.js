import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "@/components/footer/Footer";
import { ThemeContextProvider } from "@/context/ThemeContext";
import ThemeProvider from "@/providers/ThemeProvider";
import AuthProvider from "@/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ThinkNest | A Place to Spark Thoughts",
  description:
    "Explore a world of ideas, stories, and topics that matter. Welcome to ThinkNest — your home for curiosity.",
  keywords: [
    "ThinkNest",
    "blog",
    "multi-topic blog",
    "english articles",
    "personal blog",
    "tech lifestyle writing",
  ],
  authors: [
    {
      name: "ThinkNest Team",
      url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    },
  ],
  creator: "ThinkNest",
  themeColor: "#ffffff",

  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },

  manifest: "/manifest.json",

  openGraph: {
    title: "ThinkNest | A Place to Spark Thoughts",
    description:
      "Explore a world of ideas, stories, and topics that matter. Welcome to ThinkNest — your home for curiosity.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "ThinkNest",
    images: [
      {
        url:
          (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000") +
          "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ThinkNest Blog Cover",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ThinkNest | A Place to Spark Thoughts",
    description:
      "Explore a world of ideas, stories, and topics that matter. Welcome to ThinkNest — your home for curiosity.",
    creator: "@thinknest", // nếu có Twitter
    images: [
      (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000") +
        "/og-image.jpg",
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeContextProvider>
            <ThemeProvider>
              <div className="container">
                <div className="wrapper">
                  <Navbar />
                  {children}
                  <Footer />
                </div>
              </div>
            </ThemeProvider>
          </ThemeContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
