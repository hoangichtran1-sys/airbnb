import { PAGINATION } from "@/constant";
import { createLoader, parseAsInteger } from "nuqs/server";

export const paginationParams = {
    page: parseAsInteger
        .withDefault(PAGINATION.DEFAULT_PAGE)
        .withOptions({ clearOnDefault: true }),
    pageSize: parseAsInteger
        .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
        .withOptions({ clearOnDefault: true }),
};

export const paginationParamsLoader = createLoader(paginationParams);