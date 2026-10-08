import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { clsx } from "@/lib/utils";

type Variant = "primary" | "dark" | "outline" | "outline-light" | "inverted";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  arrow?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export function buttonClasses(variant: Variant = "primary", className?: string) {
  return clsx(
    "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
    variant === "primary" && "bg-brand-violet text-white shadow-[0_14px_34px_hsl(256_72%_52%/0.3)] hover:bg-brand-blue",
    variant === "dark" && "bg-ink text-white hover:bg-brand-navy",
    variant === "outline" && "border border-ink/25 bg-white text-ink hover:border-ink hover:bg-ink hover:text-white",
    variant === "outline-light" && "border border-white/60 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-ink",
    variant === "inverted" && "bg-white text-brand-navy hover:bg-lilac",
    className
  );
}

export function Button({
  href,
  children,
  variant = "primary",
  className,
  type = "button",
  arrow = true,
  disabled,
  onClick
}: ButtonProps) {
  const classes = buttonClasses(variant, className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
        {arrow ? <ArrowRight size={16} aria-hidden /> : null}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick}>
      {children}
      {arrow ? <ArrowRight size={16} aria-hidden /> : null}
    </button>
  );
}
