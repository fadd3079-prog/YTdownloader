import { cn } from "../../lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error"
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full",
        "text-[12px] leading-[16px] font-normal",
        variant === "default" && "bg-canvas-soft-2 text-body",
        variant === "success" && "bg-[#d3e5ff] text-link",
        variant === "warning" && "bg-warning-soft text-[#ab570a]",
        variant === "error" && "bg-error-soft text-error-deep",
        className
      )}
      {...props}
    />
  )
}
