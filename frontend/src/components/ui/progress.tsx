import { cn } from "../../lib/utils"

interface ProgressBarProps {
  value: number
  variant?: "default" | "gradient" | "indeterminate"
  className?: string
}

export function ProgressBar({ value, variant = "default", className }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))

  return (
    <div
      className={cn(
        "h-[6px] w-full bg-canvas-soft-2 rounded-full overflow-hidden",
        className
      )}
    >
      {variant === "indeterminate" ? (
        <div
          className="h-full rounded-full animate-pulse-gradient"
          style={{
            width: "100%",
            background: "linear-gradient(90deg, #007cf0, #00dfd8, #7928ca, #ff0080, #f9cb28)",
            backgroundSize: "200% 100%",
            animation: "gradient-flow 2.5s ease infinite, pulse-gradient 1.5s ease-in-out infinite",
          }}
        />
      ) : (
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{
            width: `${clampedValue}%`,
            background:
              variant === "gradient"
                ? "linear-gradient(90deg, #007cf0, #00dfd8)"
                : "var(--color-ink)",
          }}
        />
      )}
    </div>
  )
}
