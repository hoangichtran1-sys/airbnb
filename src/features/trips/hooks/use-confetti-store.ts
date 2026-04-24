import { useAtomValue, useSetAtom } from "jotai";
import { confettiStateAtom } from "../atoms/confetti-state-atom";

export const useConfettiStore = () => {
    const isOpenConfetti = useAtomValue(confettiStateAtom);
    const setOpenConfetti = useSetAtom(confettiStateAtom);

    const onOpenConfetti = () => setOpenConfetti(true);
    const onCloseConfetti = () => setOpenConfetti(false);

    return {
        isOpenConfetti,
        setOpenConfetti,
        onOpenConfetti,
        onCloseConfetti,
    };
};
