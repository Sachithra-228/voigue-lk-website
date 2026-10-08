import { clsx } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  tone = "light",
  as: Tag = "h2",
  className
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={clsx(align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p className={clsx("text-xs font-semibold uppercase tracking-[0.28em]", dark ? "text-white/70" : "text-brand-violet")}>
          {eyebrow}
        </p>
      ) : null}
      <Tag
        className={clsx(
          "mt-4 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl",
          dark ? "text-white" : "text-ink"
        )}
      >
        {title}
      </Tag>
      {body ? (
        <p className={clsx("mt-5 text-lg leading-8", align === "center" && "mx-auto max-w-2xl", dark ? "text-white/80" : "text-muted")}>
          {body}
        </p>
      ) : null}
    </div>
  );
}

/** Highlights part of a heading in the brand violet, e.g. "Work <Accent>Your Way</Accent>". */
export function Accent({ children }: { children: React.ReactNode }) {
  return <span className="text-brand-violet">{children}</span>;
}
