"use client";

import { Suspense } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <a className="skip-link" href="#main-content">
          رفتن به محتوای اصلی
        </a>
        <Suspense
          fallback={
            <header className="site-header">
              <div
                className="container nav-inner"
                aria-label="در حال بارگذاری منو"
              />
            </header>
          }
        >
          <Navbar />
        </Suspense>
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}
