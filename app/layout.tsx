import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Multiplicar App - Aprende las Tablas",
  description: "Aplicación educativa para aprender las tablas de multiplicar de forma interactiva y gamificada. Modo offline disponible.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Multiplicar",
  },
  applicationName: "Multiplicar App",
  keywords: ["multiplicar", "tablas", "matemáticas", "educación", "juego", "offline"],
  authors: [{ name: "Multiplicar App" }],
  generator: "Next.js",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
