"use client";

import React from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "@/lib/utils";

interface HintProps {
    children: React.ReactNode;
    text: string;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    className?: string;
}

export const Hint = ({
    children,
    text,
    side = "top",
    align = "center",
    className,
}: HintProps) => {
    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent
                    className={cn(
                        "bg-rose-500 text-white shadow-lg",
                        className,
                    )}
                    side={side}
                    align={align}
                    sideOffset={5}
                >
                    <span className="text-xs font-medium">{text}</span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
