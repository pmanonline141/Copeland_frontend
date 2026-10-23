 import Image from "next/image";
import primary from "@/assets/brand/Copeland_Logo_Primary.jpg";
import reversed from "@/assets/brand/Copeland_Logo_Reversed_Dark.jpg";
import mark from "@/assets/brand/Copeland_Monogram_CC.jpg";
import { cn } from "@/utils/cn";

const IMAGES = { primary, reversed, mark } as const;

/**
 * Official logo files (brand rule: never redraw or recolour).
 * Size it with the height only:  <Logo className="h-10" />
 */
export default function Logo({ variant = "primary", className, priority = false }: { variant?: keyof typeof IMAGES; className?: string; priority?: boolean }) {
  return (
    <Image
      src={IMAGES[variant]}
      alt="Copeland Clothiers Limited"
      priority={priority}
      // JPGs cannot be transparent, so multiply hides the white box on light backgrounds.
      className={cn("w-auto", variant !== "reversed" && "mix-blend-multiply", className)}
    />
  );
}