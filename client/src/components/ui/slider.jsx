"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "../../lib/utils"

const Slider = React.forwardRef((props, ref) => {
    const { className, ...rest } = props;

    return (
        <SliderPrimitive.Root
            ref={ref}
            className={cn("relative flex w-full touch-none select-none items-center", className)}
            {...rest}
        >
            <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-zinc-700/50">
                <SliderPrimitive.Range className="absolute h-full bg-purple-500" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border border-purple-500 bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
        </SliderPrimitive.Root>
    )
})

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
