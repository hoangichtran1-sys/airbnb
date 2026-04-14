import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error-response";
import { QueryReservations } from "@/types/query-type";
import { Treaty } from "@elysiajs/eden";
import { useSuspenseQuery } from "@tanstack/react-query";

export type ResponseType = Treaty.Data<typeof eden.reservations.get>;

interface UseGetReservationsProps {
    listingId?: string;
    queryType: QueryReservations;
}

export const useGetReservations = ({
    listingId,
    queryType,
}: UseGetReservationsProps) => {
    const query = useSuspenseQuery<ResponseType, ErrorResponse>({
        queryKey: ["reservations", listingId, queryType],
        queryFn: async () => {
            const { data, error } = await eden.reservations.get({
                query: {
                    listingId,
                    queryType,
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
