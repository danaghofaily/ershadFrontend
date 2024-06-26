

import { Inter } from "next/font/google";
import "@fontsource/plus-jakarta-sans";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GlobalProvider } from './UserContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ershad",
  description: "Generated by ershad",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative mx-auto">
        <GlobalProvider>
        <Header />
        <div className="content-wrapper">
        {children}
        </div>
        <Footer />
        </GlobalProvider>
      </body>
    </html>
  );
}
