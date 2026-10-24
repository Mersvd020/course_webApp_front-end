"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaFor, type AuthMode as Mode } from "@/lib/auth-validation";
import {
  ArrowLeft,
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import * as auth from "@/services/auth.service";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const titles: Record<Mode, string> = {
  login: "خوش برگشتی!",
  register: "شروع یک مسیر تازه",
  "forget-password": "بازیابی رمز عبور",
  "reset-password": "یک رمز تازه انتخاب کن",
};
const descriptions: Record<Mode, string> = {
  login: "وارد حساب شو و یادگیری را از سر بگیر.",
  register: "حسابت را بساز و اولین قدم را بردار.",
  "forget-password": "ایمیل حسابت را وارد کن تا کد بازیابی ارسال شود.",
  "reset-password": "کد ارسال‌شده به ایمیل و رمز جدیدت را وارد کن.",
};

export default function AuthForm({ initialMode }: { initialMode: Mode }) {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [resetToken, setResetToken] = useState<string>();
  const { signIn } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm({
    resolver: zodResolver(schemaFor(mode)),
    defaultValues: {
      email: "",
      password: "",
      phoneNumber: "",
      confirmPassword: "",
      otpCode: "",
    },
  });

  const submit = handleSubmit(async (values) => {
    try {
      if (mode === "login") {
        const session = await auth.login({
          email: values.email,
          password: values.password,
        });
        signIn(session);
        toast.success("با موفقیت وارد شدید.");
        router.push("/user/courses");
      } else if (mode === "register") {
        await auth.register({
          email: values.email,
          password: values.password,
          phoneNumber: values.phoneNumber,
        });
        toast.success("حساب شما ساخته شد. اکنون وارد شوید.");
        router.push("/user/login");
      } else if (mode === "forget-password") {
        const recovery = await auth.forgotPassword(values.email);
        setResetToken(recovery.resetToken);
        toast.success(
          "در صورت وجود حساب، کد بازیابی برای ایمیل شما ارسال می‌شود.",
        );
        setMode("reset-password");
        reset({ ...values, password: "", confirmPassword: "", otpCode: "" });
      } else {
        await auth.resetPassword(
          {
            email: values.email,
            password: values.password,
            otpCode: values.otpCode,
          },
          resetToken,
        );
        toast.success("رمز عبور تغییر کرد. با رمز جدید وارد شوید.");
        router.push("/user/login");
      }
    } catch (error) {
      toast.error(auth.authError(error));
    }
  });

  return (
    <div className="container auth-container">
      <div className="auth-panel panel">
        <div className="auth-form-area">
          <Link href="/" className="auth-logo">
            <GraduationCap size={30} />
            دانـا
          </Link>
          <h1>{titles[mode]}</h1>
          <p>{descriptions[mode]}</p>
          <form onSubmit={submit} noValidate>
            <Input
              id="email"
              label="آدرس ایمیل"
              type="email"
              dir="ltr"
              autoComplete="email"
              placeholder="you@example.com"
              readOnly={
                mode === "reset-password" && initialMode !== "reset-password"
              }
              error={errors.email?.message}
              {...register("email")}
            />
            {mode === "register" && (
              <Input
                id="phone"
                label="شماره موبایل"
                type="tel"
                dir="ltr"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="09123456789"
                error={errors.phoneNumber?.message}
                {...register("phoneNumber")}
              />
            )}
            {mode === "reset-password" && (
              <Input
                id="otp"
                label="کد تأیید"
                dir="ltr"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                error={errors.otpCode?.message}
                {...register("otpCode")}
              />
            )}
            {mode !== "forget-password" && (
              <div className="password-field">
                <Input
                  id="password"
                  label={
                    mode === "reset-password" ? "رمز عبور جدید" : "رمز عبور"
                  }
                  type={showPassword ? "text" : "password"}
                  dir="ltr"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  error={errors.password?.message}
                  {...register("password")}
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={showPassword ? "پنهان کردن رمز" : "نمایش رمز"}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            )}
            {["register", "reset-password"].includes(mode) && (
              <Input
                id="confirm-password"
                label="تکرار رمز عبور"
                type={showPassword ? "text" : "password"}
                dir="ltr"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
            )}
            {mode === "login" && (
              <Link href="/user/forget-password" className="forgot-link">
                رمز عبورت را فراموش کرده‌ای؟
              </Link>
            )}
            <Button type="submit" loading={isSubmitting}>
              {mode === "login"
                ? "ورود به حساب"
                : mode === "register"
                  ? "ساخت حساب کاربری"
                  : mode === "forget-password"
                    ? "ارسال کد بازیابی"
                    : "ذخیره رمز جدید"}
              <ArrowLeft size={18} />
            </Button>
          </form>
          {mode === "reset-password" && (
            <Button
              className="mt-3 w-full"
              variant="ghost"
              onClick={() => {
                setMode("forget-password");
                reset({
                  email: getValues("email"),
                  password: "",
                  confirmPassword: "",
                  otpCode: "",
                  phoneNumber: "",
                });
              }}
            >
              اصلاح ایمیل یا درخواست کد جدید
            </Button>
          )}
          <p className="auth-switch">
            {mode === "login" ? (
              <>
                حساب نداری؟ <Link href="/user/register">ثبت‌نام کن</Link>
              </>
            ) : (
              <>
                حساب کاربری داری؟ <Link href="/user/login">وارد شو</Link>
              </>
            )}
          </p>
        </div>
        <aside className="auth-art">
          <span className="eyebrow">یادگیری از اینجا شروع می‌شود</span>
          <div className="auth-art-icon">
            <BookOpen size={72} strokeWidth={1} />
          </div>
          <h2>
            برای آینده‌ای که
            <br />
            در ذهن داری.
          </h2>
          <p>
            هر مهارتی که یاد می‌گیری،
            <br />
            یک فرصت تازه به زندگی‌ات اضافه می‌کند.
          </p>
          <span className="auth-trust">
            <ShieldCheck size={20} />
            یک قدم کوچک، یک تغییر بزرگ
          </span>
        </aside>
      </div>
    </div>
  );
}
