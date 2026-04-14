import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error-response";
import { Treaty } from "@elysiajs/eden";
import { useQuery } from "@tanstack/react-query";

export type ResponseType = Treaty.Data<typeof eden.listings.favorite.get>;

export const useGetListingsFavorite = () => {
    const query = useQuery<ResponseType, ErrorResponse>({
        queryKey: ["listings-favorite"],
        queryFn: async () => {
            const { data, error } = await eden.listings.favorite.get();

            if (error) {
                throw error.value;
            }

            return data;
        },
    });

    return query;
};
