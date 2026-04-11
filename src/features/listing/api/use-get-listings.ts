import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types";
import { Treaty } from "@elysiajs/eden";
import { useQuery } from "@tanstack/react-query";

type ResponseType = Treaty.Data<typeof eden.listings.get>;

export const useGetListings = () => {
    const query = useQuery<ResponseType, ErrorResponse>({
        queryKey: ["listings"],
        queryFn: async () => {
            const { data, error } = await eden.listings.get();

            if (error) {
                throw error.value;
            }

            return data;
        },
    });

    return query;
};
