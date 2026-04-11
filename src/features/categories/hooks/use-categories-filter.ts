import { useQueryState, parseAsString } from "nuqs";

export const useCategoriesFilter = () => {
    return useQueryState(
        "category",
        parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    );
};
