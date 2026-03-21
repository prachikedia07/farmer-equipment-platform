// src/components/ui/badge.tsx
import React from "react";

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
      {children}
    </span>
  );
}