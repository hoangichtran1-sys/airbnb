import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error-response";
import { ListingsSort } from "@/types/sort-type";
import { Treaty } from "@elysiajs/eden";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

export type ResponseType = Treaty.Data<typeof eden.listings.get>;

interface UseGetListingsProps {
    category?: string;
    guestCount?: number | null;
    roomCount?: number | null;
    bathroomCount?: number | null;
    bedroomCount?: number | null;
    locationValue?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    sort?: ListingsSort;
    headers?: HeadersInit;
    limit: number;
    cursor?: { id: string };
}

export const getListings = async ({
    category,
    guestCount,
    roomCount,
    bathroomCount,
    bedroomCount,
    locationValue,
    startDate,
    endDate,
    sort,
    limit,
    headers,
}: UseGetListingsProps) => {
    const { data, error } = await eden.listings.get({
        query: {
            category,
            guestCount,
            roomCount,
            bathroomCount,
            bedroomCount,
            locationValue,
            startDate,
            endDate,
            sort,
            limit,
        },
        headers,
    });

    if (error) {
        throw error.value;
    }

    return data;
};

export const useGetListings = ({
    category,
    guestCount,
    roomCount,
    bathroomCount,
    bedroomCount,
    locationValue,
    startDate,
    endDate,
    sort,
    limit,
}: UseGetListingsProps) => {
    const query = useSuspenseInfiniteQuery<ResponseType, ErrorResponse>({
        queryKey: [
            "listings",
            category,
            guestCount,
            roomCount,
            bathroomCount,
            bedroomCount,
            locationValue,
            startDate,
            endDate,
            sort,
            limit,
        ],
        queryFn: ({ pageParam }) =>
            getListings({
                category,
                guestCount,
                roomCount,
                bathroomCount,
                bedroomCount,
                locationValue,
                startDate,
                endDate,
                sort,
                limit,
                cursor: pageParam as { id: string } | undefined,
            }),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

    return query;
};
