import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150 cursor-pointer disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link",
  {
    variants: {
      variant: {
        primary: "bg-ink text-on-primary hover:bg-ink/90 active:scale-[0.98]",
        secondary: "bg-canvas text-ink shadow-level-1 hover:bg-canvas-soft-2 active:scale-[0.98]",
        ghost: "text-body hover:text-ink hover:bg-canvas-soft-2",
        danger: "bg-error text-on-primary hover:bg-error-deep active:scale-[0.98]",
        link: "text-link hover:text-link-deep underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        lg: "h-12 px-5 text-[16px] leading-[24px] rounded-[100px]",
        md: "h-10 px-4 text-[14px] leading-[20px] rounded-[100px]",
        sm: "h-8 px-3 text-[14px] leading-[20px] rounded-[100px]",
        nav: "h-7 px-2 text-[14px] leading-[20px] font-medium rounded-[6px]",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
