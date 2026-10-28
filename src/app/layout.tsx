import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#024B38",
};

export const metadata: Metadata = {
  title: "Ricuras de Sal y Dulce | Cafetería de Especialidad y Cocina Tradicional en Loja",
  description:
    "Cafetería de especialidad con cocina tradicional manabita y ecuatoriana en Loja, Ecuador. Desayunos típicos, platos de verde, bolones y repostería en San Sebastián y Loja Pádel Club.",
  keywords: [
    "Ricuras de Sal y Dulce",
    "Restaurante Loja",
    "Café de especialidad Loja",
    "Desayunos Loja",
    "Comida manabita Loja",
    "Comida ecuatoriana Loja",
    "San Sebastián Loja",
  ],
  authors: [{ name: "Ricuras de Sal y Dulce" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="min-h-screen bg-brand-latte text-brand-espresso flex flex-col selection:bg-brand-terracotta selection:text-white">
        {children}
      </body>
    </html>
  );
}
