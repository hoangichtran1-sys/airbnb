import { useQueryStates } from "nuqs";
import { paginationParams } from "../params";

export const usePaginationParams = () => {
    return useQueryStates(paginationParams);
};
