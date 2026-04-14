import { useQueryStates } from "nuqs";
import { listingsSortParams } from "../params";

export const useListingsSort = () => {
    return useQueryStates(listingsSortParams);
};
