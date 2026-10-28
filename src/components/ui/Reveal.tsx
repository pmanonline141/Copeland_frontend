"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

type Tag = "div" | "section" | "li" | "article" | "span";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger in milliseconds. */
  delay?: number;
  as?: Tag;
}

/**
 * Fades + lifts children into place once they scroll into view.
 * Animation is defined in globals.css (.reveal / .is-visible) so it respects
 * prefers-reduced-motion. A <noscript> fallback in the root layout keeps the
 * content visible when JavaScript is unavailable.
 */
export default function Reveal({ children, className, delay = 0, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref}
      className={cn("reveal", visible && "is-visible", className)}
      style={delay ? ({ ["--reveal-delay" as string]: `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Component>
  );
}
