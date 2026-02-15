import * as React from "react"

import { cn } from "@/lib/utils"

type SwitchProps = React.InputHTMLAttributes<HTMLInputElement> & {
  size?: "sm" | "default"
}

/**
 * Lightweight Switch implemented with a hidden checkbox (peer) to avoid requiring @radix-ui/react-switch.
 * Keeps the same data attributes and Tailwind utility classes so styles remain compatible.
 */
const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { className, size = "default", ...props },
  ref
) {
  return (
    <label
      data-slot="switch-wrapper"
      style={{ display: "inline-block" }}
    >
      <input
        type="checkbox"
        role="switch"
        data-size={size}
        className="sr-only peer"
        ref={ref}
        {...props}
      />
      <span
        data-slot="switch"
        data-size={size}
        className={cn(
          "peer-checked:bg-primary bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/80 inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-[1.15rem] data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6",
          className
        )}
      >
        <span
          data-slot="switch-thumb"
          className={cn(
            "bg-background dark:bg-foreground pointer-events-none block rounded-full ring-0 transition-transform translate-x-0 peer-checked:translate-x-[calc(100%-2px)] data-[size=default]:h-4 data-[size=default]:w-4 data-[size=sm]:h-3 data-[size=sm]:w-3"
          )}
        />
      </span>
    </label>
  )
})

Switch.displayName = "Switch"

export { Switch }
