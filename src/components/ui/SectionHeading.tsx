import { cn } from "@/utils/cn";

/** Eyebrow + serif title + optional intro. Reused by every landing section so they all feel the same. */
export default function SectionHeading({
  eyebrow, title, description, align = "left", tone = "light", className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className={cn("eyebrow", dark && "!text-gold-300", align === "center" && "justify-center")}>{eyebrow}</p>}
      <h2 className={cn("mt-4 text-3xl font-semibold sm:text-4xl lg:text-5xl", dark ? "text-white" : "text-ink")}>{title}</h2>
      {description && <p className={cn("mt-4 text-lg", dark ? "text-white/75" : "text-ink-soft")}>{description}</p>}
    </div>
  );
}
