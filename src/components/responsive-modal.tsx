"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "./ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "./ui/separator";

interface ResponsiveModalProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ResponsiveModal({
    title,
    description,
    children,
    open,
    onOpenChange,
}: ResponsiveModalProps) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent className="max-h-[90vh] flex flex-col">
                    <DrawerHeader>
                        <DrawerTitle>{title}</DrawerTitle>
                        {description && (
                            <DrawerDescription>{description}</DrawerDescription>
                        )}
                    </DrawerHeader>
                    <Separator />
                    <div className="flex-1 overflow-y-auto p-4 pb-8">
                        {children}
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">{title}</DialogTitle>
                    {description && (
                        <DialogDescription className="text-center">
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>
                <Separator />
                {children}
            </DialogContent>
        </Dialog>
    );
}
