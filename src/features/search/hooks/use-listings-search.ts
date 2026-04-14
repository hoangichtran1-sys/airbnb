import { useQueryStates } from "nuqs";
import { listingsSearchParams } from "../params";

export const useListingsSearch = () => {
    return useQueryStates(listingsSearchParams);
};
