import { parseAsString, createLoader } from "nuqs/server";

export const categoriesFilter = {
    category: parseAsString
        .withDefault("")
        .withOptions({ clearOnDefault: true, shallow: false }),
};

export const loaderCategoriesFilter = createLoader(categoriesFilter);
