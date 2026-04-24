"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    BellIcon,
    BrushCleaningIcon,
    CheckIcon,
    EllipsisVerticalIcon,
    ListChecksIcon,
    XIcon,
} from "lucide-react";
import { useGetNotifications } from "../../api/use-get-notifications";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useDeleteNotification } from "../../api/use-delete-notification";
import { useUpdateNotification } from "../../api/use-update-notification";
import { useBulkDeleteNotifications } from "../../api/use-bulk-delete-notifications";
import { useBulkUpdateNotifications } from "../../api/use-bulk-update-notifications";

export const NotificationMenu = () => {
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const { data } = useGetNotifications();

    const notifications = data || [];

    const unreadNotifications = notifications.filter(
        (n) => n.status === "UNREAD",
    );

    const notificationIdsRemove = notifications.map((n) => n.id);
    const notificationIdsUpdate = unreadNotifications.map((n) => n.id)

    const remove = useDeleteNotification();
    const update = useUpdateNotification();
    const bulkRemove = useBulkDeleteNotifications();
    const bulkUpdate = useBulkUpdateNotifications();

    const handleRemove = (id: string) => {
        setRemovingId(id);

        setTimeout(() => {
            remove.mutate({ notificationId: id });
        }, 200);
    };

    const handleUpdate = (id: string) => {
        setUpdatingId(id);

        setTimeout(() => {
            update.mutate({ notificationId: id });
        }, 200);
    };

    const handleBulkUpdate = () => {
        bulkUpdate.mutate({ notificationIds: notificationIdsUpdate })
    }

    const handleBulkRemove = () => {
        bulkRemove.mutate({ notificationIds: notificationIdsRemove })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full"
                >
                    <BellIcon className="size-5" />
                    {unreadNotifications.length > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                        >
                            {unreadNotifications.length}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-2" align="center">
                <div className="flex items-center justify-between p-2">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {unreadNotifications.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                    <EllipsisVerticalIcon className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right">
                                <DropdownMenuItem onClick={handleBulkUpdate} disabled={notificationIdsUpdate.length === 0}>
                                    <ListChecksIcon />
                                    <span className="text-xs text-neutral-600">
                                        Mark all as read
                                    </span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleBulkRemove} disabled={notificationIdsRemove.length === 0}>
                                    <BrushCleaningIcon />
                                    <span className="text-xs text-neutral-600">
                                        Clear all
                                    </span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
                <Separator />
                <div className="space-y-1">
                    {notifications.length > 0 ? (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                className={cn(
                                    "rounded-md p-3 text-sm transition-all duration-200 relative",
                                    n.status === "UNREAD"
                                        ? "bg-muted/50 font-medium hover:bg-muted/70"
                                        : "bg-background text-muted-foreground",
                                    removingId === n.id &&
                                        "opacity-0 translate-x-5",
                                    updatingId === n.id &&
                                        "opacity-0 translate-y-5",
                                )}
                            >
                                <div className="absolute top-2 right-2 flex flex-row gap-x-2">
                                    <Button
                                        className="hover:scale-110 active:scale-95 transition-transform"
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={() => handleUpdate(n.id)}
                                        disabled={
                                            update.isPending || remove.isPending
                                        }
                                    >
                                        <CheckIcon />
                                    </Button>
                                    <Button
                                        className="hover:scale-110 active:scale-95 transition-transform"
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={() => handleRemove(n.id)}
                                        disabled={
                                            update.isPending || remove.isPending
                                        }
                                    >
                                        <XIcon />
                                    </Button>
                                </div>
                                <p className="font-medium">{n.title}</p>
                                <p className="text-muted-foreground text-xs">
                                    {n.content || "No content"}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center italic text-sm p-4 text-muted-foreground mt-4">
                            No new notifications
                        </p>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};
