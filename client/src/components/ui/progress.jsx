"use client";

import React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "../../lib/utils";

const Progress = React.forwardRef((props, ref) => {
    const { className, value, ...rest } = props;

    return (
        <ProgressPrimitive.Root
            ref={ref}
            className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className)}
            {...rest}
        >
            <ProgressPrimitive.Indicator
                className="h-full w-full flex-1 bg-pink-500 transition-all"
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    );
});

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
