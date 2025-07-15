import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { WalletProvider } from "@/context/wallet-context";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/lib/react-query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Metrics NFTs",
  description:
    "Acompanhe as principais métricas do mercado de NFTs em um só lugar: coleções em alta, preços mínimos, retorno sobre investimento e análises diárias com IA.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body
          className={`${geistSans.variable} ${geistMono.variable} dark bg-secondary antialiased`}
        >
          <ReactQueryProvider>
            <WalletProvider>{children}</WalletProvider>
            <Toaster />
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
