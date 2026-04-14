import { sortValues } from "@/types/sort-type";
import { parseAsStringEnum, createLoader } from "nuqs/server";

export const listingsSortParams = {
    sort: parseAsStringEnum(sortValues)
        .withDefault("newest")
        .withOptions({ clearOnDefault: true }),
};

export const loaderListingsSortParams = createLoader(listingsSortParams);
