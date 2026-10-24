import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost";
};

export default function Button({
  className,
  children,
  loading,
  disabled,
  variant = "primary",
  ...props
}: Props) {
  return (
    <button
      className={cn("button", `button-${variant}`, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <LoaderCircle className="animate-spin" size={18} aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
