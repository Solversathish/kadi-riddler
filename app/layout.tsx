import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kadi Riddler — Think. Laugh. Get Tricked.",
  description:
    "Fun riddles, Tamil kadi jokes, funny questions and amazing facts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}