import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error-response";
import { QueryListings } from "@/types/query-type";
import { ListingsSort } from "@/types/sort-type";
import { Treaty } from "@elysiajs/eden";
import { useSuspenseQuery } from "@tanstack/react-query";

export type ResponseType = Treaty.Data<typeof eden.listings.get>;

interface UseGetListingsProps {
    queryType: QueryListings;
    category?: string;
    guestCount?: number | null;
    roomCount?: number | null;
    bathroomCount?: number | null;
    locationValue?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    sort?: ListingsSort;
    headers?: HeadersInit;
}

export const getListings = async ({
    queryType,
    category,
    guestCount,
    roomCount,
    bathroomCount,
    locationValue,
    startDate,
    endDate,
    sort,
    headers,
}: UseGetListingsProps) => {
    const { data, error } = await eden.listings.get({
        query: {
            queryType,
            category,
            guestCount,
            roomCount,
            bathroomCount,
            locationValue,
            startDate,
            endDate,
            sort,
        },
        headers,
    });

    if (error) {
        throw error.value;
    }

    return data;
};

export const useGetListings = ({
    queryType,
    category,
    guestCount,
    roomCount,
    bathroomCount,
    locationValue,
    startDate,
    endDate,
    sort,
}: UseGetListingsProps) => {
    const query = useSuspenseQuery<ResponseType, ErrorResponse>({
        queryKey: [
            "listings",
            queryType,
            category,
            guestCount,
            roomCount,
            bathroomCount,
            locationValue,
            startDate,
            endDate,
            sort,
        ],
        queryFn: () =>
            getListings({
                queryType,
                category,
                guestCount,
                roomCount,
                bathroomCount,
                locationValue,
                startDate,
                endDate,
                sort,
            }),
    });

    return query;
};
