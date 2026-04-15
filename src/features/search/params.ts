import {
    parseAsString,
    parseAsIsoDate,
    parseAsInteger,
    createLoader,
} from "nuqs/server";

export const listingsSearchParams = {
    locationValue: parseAsString.withOptions({ clearOnDefault: true }),
    guestCount: parseAsInteger.withOptions({ clearOnDefault: true }),
    roomCount: parseAsInteger.withOptions({ clearOnDefault: true }),
    bathroomCount: parseAsInteger.withOptions({ clearOnDefault: true }),
    startDate: parseAsIsoDate.withOptions({ clearOnDefault: true }),
    endDate: parseAsIsoDate.withOptions({ clearOnDefault: true }),
};

export const loaderListingsSearchParams = createLoader(listingsSearchParams);
