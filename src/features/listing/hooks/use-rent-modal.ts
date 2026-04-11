import { useAtomValue, useSetAtom } from "jotai";
import { rentModalState } from "../atoms/rent-modal-state";

export const useRentModal = () => {
    const openRentModal = useAtomValue(rentModalState);
    const setOpenRentModal = useSetAtom(rentModalState);

    const onOpenRentModal = () => setOpenRentModal(true);
    const onCloseRentModal = () => setOpenRentModal(false);

    return {
        openRentModal,
        setOpenRentModal,
        onOpenRentModal,
        onCloseRentModal,
    };
};
