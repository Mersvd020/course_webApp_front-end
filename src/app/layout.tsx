import type { Metadata } from "next";
import "./globals.css";
import localFont from 'next/font/local'
import { ThemeProvider } from "@/components/darkmode/theme-Provider"



import { Toaster } from "react-hot-toast"

const Yekan = localFont({
   src:"../assets/font/iran-yekan/IRANYekanMedium.ttf",
   style:"normal",
})


export const metadata: Metadata = {
  title: "آکادمی رویش | یادگیری مهارت‌های کاربردی",
  description: "دوره‌های آموزشی برنامه‌نویسی، طراحی، بازاریابی و کسب‌وکار",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="fa" suppressHydrationWarning className={Yekan.className} >
     
      <body className="layout" >

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          >
        {children}

        </ThemeProvider>


        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
          }}
        />
        
        </body>

    </html>
  );
}
