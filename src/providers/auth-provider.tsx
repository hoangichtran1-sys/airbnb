"use client";

import { SignInModal } from "@/features/auth/ui/components/sign-in-modal";
import { useState } from "react";

export const AuthProvider = () => {
    const [isOpenModalSignIn, setIsOpenModalSignIn] = useState(true);

    return (
        <>
            <SignInModal
                open={isOpenModalSignIn}
                onOpenChange={setIsOpenModalSignIn}
            />
        </>
    );
};
