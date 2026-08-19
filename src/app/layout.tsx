import type { Metadata } from "next";
import { Be_Vietnam_Pro, Manrope } from "next/font/google";
import "./globals.css";

const display = Manrope({ subsets: ["latin", "vietnamese"], variable: "--font-display" });
const body = Be_Vietnam_Pro({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600", "700"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: { default: "Xưởng Công Nghệ — Học, luyện, ứng dụng", template: "%s | Xưởng Công Nghệ" },
  description: "Nền tảng học và thực hành năng lực số qua các khóa học, bài luyện và dự án thực tế.",
  openGraph: {
    title: "Xưởng Công Nghệ — Học, luyện, ứng dụng",
    description: "Phát triển năng lực số qua học tập, thực hành và dự án thật.",
    images: [{ url: "/og.png", width: 1744, height: 907, alt: "Xưởng Công Nghệ" }],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Xưởng Công Nghệ — Học, luyện, ứng dụng",
    description: "Phát triển năng lực số qua học tập, thực hành và dự án thật.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body className={`${display.variable} ${body.variable}`}>{children}</body></html>;
}
