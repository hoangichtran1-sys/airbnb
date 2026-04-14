"use client";

import { AvatarUser } from "@/components/avatar-user";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useLoginModal } from "@/features/auth/hooks/use-login-modal";
import { useRegisterModal } from "@/features/auth/hooks/use-register-modal";
import { User } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { LogInIcon, LogOutIcon } from "lucide-react";
import { AiOutlineMenu } from "react-icons/ai";
import { MdPersonAddAlt } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FiHelpCircle } from "react-icons/fi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useRentModal } from "@/features/listing/hooks/use-rent-modal";

// type UserData = Treaty.Data<typeof eden.health.get>;
// type UserError = Treaty.Error<typeof eden.health.get>;

interface UserMenuProps {
    currentUser: User | null;
}

export const UserMenu = ({ currentUser }: UserMenuProps) => {
    const router = useRouter();

    const { onOpenLoginModal } = useLoginModal();
    const { onOpenRegisterModal } = useRegisterModal();
    const { onOpenRentModal } = useRentModal();

    const onLogout = () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Logout successfully");
                    router.refresh();
                },
            },
        });
    };

    const onRent = () => {
        if (!currentUser) {
            onOpenLoginModal();
            return;
        }
        onOpenRentModal();
    };

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                <div
                    onClick={onRent}
                    className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
                >
                    Airbnb your home
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger className="p-4 md:py-1 md:px-2 border border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition">
                        <AiOutlineMenu />
                        <div className="hidden md:block">
                            <AvatarUser user={currentUser} />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        sideOffset={8}
                        className="w-48 md:w-36 rounded-xl shadow-md bg-white overflow-hidden right-0 top-12 text-sm font-semibold"
                    >
                        {currentUser ? (
                            <>
                                <DropdownMenuItem
                                    onClick={() => router.push("/trips")}
                                >
                                    My trips
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => router.push("/favorites")}
                                >
                                    My favorites
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => router.push("/reservations")}
                                >
                                    My reservations
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => router.push("/properties")}
                                >
                                    My properties
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onOpenRentModal}>
                                    Airbnb my home
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => {}}>
                                    <CgProfile />
                                    My profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {}}>
                                    <FiHelpCircle />
                                    Help
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onLogout}>
                                    <LogOutIcon />
                                    Logout
                                </DropdownMenuItem>
                            </>
                        ) : (
                            <>
                                <DropdownMenuItem onClick={onOpenLoginModal}>
                                    <LogInIcon />
                                    Login
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onOpenRegisterModal}>
                                    <MdPersonAddAlt />
                                    Sign up
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};
