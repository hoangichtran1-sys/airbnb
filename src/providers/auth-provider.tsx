"use client";

import { useLoginModal } from "@/features/auth/hooks/use-login-modal";
import { useRegisterModal } from "@/features/auth/hooks/use-register-modal";
import { SignInModal } from "@/features/auth/ui/components/sign-in-modal";
import { SignUpModal } from "@/features/auth/ui/components/sign-up-modal";

export const AuthProvider = () => {
    const { openLoginModal, setOpenLoginModal } = useLoginModal();
    const { openRegisterModal, setOpenRegisterModal } = useRegisterModal();

    return (
        <>
            <SignInModal
                open={openLoginModal}
                onOpenChange={setOpenLoginModal}
            />
            <SignUpModal
                open={openRegisterModal}
                onOpenChange={setOpenRegisterModal}
            />
        </>
    );
};
