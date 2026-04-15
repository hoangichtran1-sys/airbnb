import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error-response";
import { Treaty } from "@elysiajs/eden";
import { useSuspenseQuery } from "@tanstack/react-query";

export type ResponseType = Treaty.Data<typeof eden.listings.favorite.get>;

export const getListingsFavorite = async ({
    headers,
}: {
    headers?: HeadersInit;
}) => {
    const { data, error } = await eden.listings.favorite.get({ headers});

    if (error) {
        throw error.value;
    }

    return data;
};

export const useGetListingsFavorite = () => {
    const query = useSuspenseQuery<ResponseType, ErrorResponse>({
        queryKey: ["listings-favorite"],
        queryFn: () => getListingsFavorite({}),
    });

    return query;
};
