// src/components/ui/utils.ts
export function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}