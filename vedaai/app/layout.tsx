import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";

export const metadata: Metadata = {
  title: "VedaAI — Assessment Creator",
  description: "AI-powered assessment creation for teachers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-app-gradient p-6 pb-24 md:pb-6">
            {children}
          </main>
        </div>
        <MobileNav />
      </body>
    </html>
  );
}
