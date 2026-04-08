import { useAtomValue, useSetAtom } from "jotai";
import { authModalState } from "../atoms/auth-modal-state";

export const useAuthModal = () => {
    const openAuthModal = useAtomValue(authModalState);
    const setOpenAuthModal = useSetAtom(authModalState);

    const onOpen = () => setOpenAuthModal(true);
    const onClose = () => setOpenAuthModal(false);

    return {
        openAuthModal,
        setOpenAuthModal,
        onOpen,
        onClose,
    };
};
