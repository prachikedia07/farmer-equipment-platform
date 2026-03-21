// src/components/ui/input.tsx

import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-xl border-[#DDD0BE] bg-[#FDFAF5] px-3 py-2 text-sm text-[#2C1A0E] placeholder:text-[#5C3D1E] outline-none transition focus:ring-2 focus:ring-[#4A2E15]/10 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };