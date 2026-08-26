import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import AppProviders from "@/components/providers/AppProviders";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "Team LX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body className={notoSansKr.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
