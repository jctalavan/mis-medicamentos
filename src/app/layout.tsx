import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Sidebar } from "@/components/layout/sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "MisMedicamentos - Gestión de medicamentos",
  description: "Gestiona los medicamentos de tu hogar: caducidades, indicaciones, historial de administraciones y más.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans`}>
        <QueryProvider>
          <div className="min-h-screen bg-background">
            <Sidebar />
            <main className="md:pl-64 pb-20 md:pb-0">
              <div className="container max-w-5xl mx-auto px-4 py-6 md:py-8">
                {children}
              </div>
            </main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
