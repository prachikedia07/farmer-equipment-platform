import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "./utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
  asChild?: boolean;
};

export function Button({
  children,
  className,
  variant = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  const base =
    "inline-flex items-center justify-center px-6 py-3 rounded-[10px] text-sm font-medium transition";

  const styles =
    variant === "outline"
      ? "border-2 border-[#5C3D1E] text-[#5C3D1E] hover:bg-[#F5EDD8]"
      : "bg-[#5C3D1E] text-white hover:bg-[#4A2E15]";

  return (
    <Comp className={cn(base, styles, className)} {...props}>
      {children}
    </Comp>
  );
}