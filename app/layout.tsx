import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "سامانه آموزش آنلاین و فروش دوره",
  description: "پروژه کارآموزی وبسایت فروش دوره‌های تخصصی",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col font-sans">
        {children}
        {/* کامپوننت نمایش پیام‌ها */}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
