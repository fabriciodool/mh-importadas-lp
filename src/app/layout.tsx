import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "M&H | Assistência Técnica para Eletrodomésticos Importados",
  description:
    "Atendimento técnico especializado para equipamentos importados e de alto padrão — Sub Zero, Viking, Wolf, Gaggenau, Miele, Smeg e mais. São Paulo e regiões selecionadas.",
  robots: "index, follow",
  openGraph: {
    title: "M&H | Assistência Técnica para Eletrodomésticos Importados",
    description:
      "Atendimento técnico especializado para equipamentos importados e de alto padrão em São Paulo.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
