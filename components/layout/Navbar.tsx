"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  GraduationCap,
  Heart,
  LogOut,
  Menu,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export default function Navbar() {
  const { session, signOut, ready } = useAuth();
  const { cart, checkingOut } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const profileButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    function dismiss(event: PointerEvent) {
      if (!profileRef.current?.contains(event.target as Node))
        setProfileOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setMenuOpen(false);
        if (profileOpen) profileButton.current?.focus();
      }
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [profileOpen]);

  function logout() {
    try {
      signOut();
      setProfileOpen(false);
      router.push("/");
      toast.success("از حساب خارج شدید.");
    } catch {
      toast.error("خروج از حساب انجام نشد. دوباره تلاش کنید.");
    }
  }

  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Link href="/" className="brand">
          <span className="brand-icon">
            <GraduationCap size={27} />
          </span>
          <span>
            دانـا<span className="brand-subtitle">یک قدم جلوتر</span>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="ناوبری اصلی">
          <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
            خانه
          </Link>
          <Link
            href="/course"
            aria-current={pathname.startsWith("/course") ? "page" : undefined}
          >
            همه دوره‌ها
          </Link>
          <Link href="/course?filter=discounted">
            تخفیف‌های ویژه <span className="nav-dot" />
          </Link>
        </nav>
        <div className="nav-actions">
          <Link
            href="/cart"
            className="icon-button cart-link"
            aria-label={`سبد خرید، ${cart.length} دوره`}
          >
            <ShoppingBag size={21} />
            {cart.length > 0 && (
              <span className="cart-badge">
                {cart.length.toLocaleString("fa-IR")}
              </span>
            )}
          </Link>
          {ready && session ? (
            <div
              className="profile"
              ref={profileRef}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget))
                  setProfileOpen(false);
              }}
            >
              <button
                ref={profileButton}
                className="button button-secondary profile-toggle"
                aria-label="حساب کاربری"
                aria-expanded={profileOpen}
                aria-controls="profile-menu"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <UserRound size={19} />
                <ChevronDown size={14} />
              </button>
              {profileOpen && (
                <div id="profile-menu" className="profile-menu">
                  <p dir="ltr">{session.email}</p>
                  <Link
                    href="/user/courses"
                    onClick={() => setProfileOpen(false)}
                  >
                    <BookOpen size={17} />
                    دوره‌های من
                  </Link>
                  <Link
                    href="/user/wishlist"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Heart size={17} />
                    علاقه‌مندی‌ها
                  </Link>
                  <button disabled={checkingOut} onClick={logout}>
                    <LogOut size={17} />
                    خروج از حساب کاربری
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/user/login"
              className="button button-primary login-link"
            >
              <UserRound size={18} />
              <span>ورود / ثبت‌نام</span>
            </Link>
          )}
          <button
            className="icon-button mobile-menu-toggle"
            aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav
          id="mobile-nav"
          className="mobile-nav container"
          aria-label="ناوبری موبایل"
        >
          {[
            ["/", "خانه"],
            ["/course", "همه دوره‌ها"],
            ["/course?filter=discounted", "تخفیف‌های ویژه"],
            ["/user/courses", "دوره‌های من"],
            ["/user/wishlist", "علاقه‌مندی‌ها"],
          ].map(([href, label]) => (
            <Link href={href} key={href} onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
