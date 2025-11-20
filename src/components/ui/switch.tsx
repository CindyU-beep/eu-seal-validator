"use client"

import { ComponentProps } from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-[oklch(0.62_0.15_230)] data-[state=unchecked]:bg-muted focus-visible:ring-ring/50 inline-flex h-9 w-[4.5rem] shrink-0 items-center rounded-full border-0 shadow-sm transition-all duration-300 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 p-1",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-background pointer-events-none block size-7 rounded-full shadow-md ring-0 transition-transform duration-300 ease-out data-[state=checked]:translate-x-[calc(100%+0.25rem)] data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
