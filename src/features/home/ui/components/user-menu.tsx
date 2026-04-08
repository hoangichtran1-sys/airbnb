"use client";

import { Avatar } from "@/components/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogInIcon } from "lucide-react";
import { AiOutlineMenu } from "react-icons/ai";
import { MdPersonAddAlt } from "react-icons/md";

export const UserMenu = () => {
    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                <div className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer">
                    Airbnb your home
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger className="p-4 md:py-1 md:px-2 border border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition">
                        <AiOutlineMenu />
                        <div className="hidden md:block">
                            <Avatar />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        sideOffset={8}
                        className="w-48 md:w-36 rounded-xl shadow-md bg-white overflow-hidden right-0 top-12 text-sm"
                    >
                        <DropdownMenuItem>
                            <LogInIcon />
                            Login
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <MdPersonAddAlt />
                            Sign up
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};
