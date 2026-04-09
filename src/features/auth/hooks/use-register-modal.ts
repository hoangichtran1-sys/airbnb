import { useAtomValue, useSetAtom } from "jotai";
import { registerModalState } from "../atoms/register-modal-state";

export const useRegisterModal = () => {
    const openRegisterModal = useAtomValue(registerModalState);
    const setOpenRegisterModal = useSetAtom(registerModalState);

    const onOpenRegisterModal = () => setOpenRegisterModal(true);
    const onCloseRegisterModal = () => setOpenRegisterModal(false);

    return {
        openRegisterModal,
        setOpenRegisterModal,
        onOpenRegisterModal,
        onCloseRegisterModal,
    };
};
