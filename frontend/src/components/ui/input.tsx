import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full bg-canvas px-3 text-[14px] leading-[20px] tracking-[-0.28px] text-ink",
          "border border-hairline rounded-[6px] shadow-level-1",
          "placeholder:text-mute",
          "outline-none focus:border-hairline-strong focus:shadow-level-2",
          "transition-all duration-150",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

const InputLg = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full bg-canvas px-4 text-[16px] leading-[24px] text-ink",
          "border border-hairline rounded-[6px] shadow-level-1",
          "placeholder:text-mute",
          "outline-none focus:border-hairline-strong focus:shadow-level-2",
          "transition-all duration-150",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
InputLg.displayName = "InputLg"

export { Input, InputLg }
