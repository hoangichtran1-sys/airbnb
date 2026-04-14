import { useQueryStates } from "nuqs";
import { categoriesFilter } from "../params";

export const useCategoriesFilter = () => {
    return useQueryStates(categoriesFilter);
};
