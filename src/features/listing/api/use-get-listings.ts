import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error-response";
import { QueryListings } from "@/types/query-type";
import { ListingsSort } from "@/types/sort-type";
import { Treaty } from "@elysiajs/eden";
import { useQuery } from "@tanstack/react-query";

export type ResponseType = Treaty.Data<typeof eden.listings.get>;

interface UseGetListingsProps {
    queryType?: QueryListings;
    category?: string;
    guestCount?: number | null;
    roomCount?: number | null;
    bathroomCount?: number | null;
    locationValue?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    sort?: ListingsSort;
}

export const useGetListings = ({
    queryType = "all",
    category,
    guestCount,
    roomCount,
    bathroomCount,
    locationValue,
    startDate,
    endDate,
    sort,
}: UseGetListingsProps) => {
    const query = useQuery<ResponseType, ErrorResponse>({
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
        queryFn: async () => {
            const { data, error } = await eden.listings.get({
                query: {
                    category,
                    queryType,
                    guestCount,
                    roomCount,
                    bathroomCount,
                    locationValue,
                    startDate,
                    endDate,
                    sort,
                },
            });

            if (error) {
                throw error.value;
            }

            return data;
        },
    });

    return query;
};
