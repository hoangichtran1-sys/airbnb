import { useAtomValue, useSetAtom } from "jotai";
import { searchModalState } from "../atoms/search-modal-state";

export const useSearchModal = () => {
    const openSearchModal = useAtomValue(searchModalState);
    const setOpenSearchModal = useSetAtom(searchModalState);

    const onOpenSearchModal = () => setOpenSearchModal(true);
    const onCloseSearchModal = () => setOpenSearchModal(false);

    return {
        openSearchModal,
        setOpenSearchModal,
        onOpenSearchModal,
        onCloseSearchModal,
    };
};
