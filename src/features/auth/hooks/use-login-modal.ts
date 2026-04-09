import { useAtomValue, useSetAtom } from "jotai";
import { loginModalState } from "../atoms/login-modal-state";

export const useLoginModal = () => {
    const openLoginModal = useAtomValue(loginModalState);
    const setOpenLoginModal = useSetAtom(loginModalState);

    const onOpenLoginModal = () => setOpenLoginModal(true);
    const onCloseLoginModal = () => setOpenLoginModal(false);

    return {
        openLoginModal,
        setOpenLoginModal,
        onOpenLoginModal,
        onCloseLoginModal,
    };
};
