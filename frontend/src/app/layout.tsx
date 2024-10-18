import type { Metadata } from "next";
import { Montserrat } from 'next/font/google'
import "./globals.css";

const montserrat = Montserrat({
    weight: '400',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: "Painel de Lojas - Grupo Koch",
    description: "Painel para visualização das lojas do Grupo Koch",
};

export default function RootLayout({
    children,
}:   Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="pt">
            <body className={montserrat.className}>{children}</body>
        </html>
    );
}
