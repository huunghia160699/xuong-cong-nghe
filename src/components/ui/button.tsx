import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Props = ComponentProps<typeof Link> & { variant?: "primary" | "outline" | "ghost"; size?: "sm" | "md" | "lg" };

export function Button({ className, variant = "primary", size = "md", ...props }: Props) {
  return <Link className={cn("inline-flex items-center justify-center rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2", variant === "primary" && "bg-blue text-white hover:bg-blue/90", variant === "outline" && "border border-zinc-300 bg-white text-ink hover:bg-zinc-50", variant === "ghost" && "text-ink hover:bg-zinc-100", size === "sm" && "h-10 px-4 text-sm", size === "md" && "h-11 px-5 text-base", size === "lg" && "h-12 px-6", className)} {...props} />;
}
