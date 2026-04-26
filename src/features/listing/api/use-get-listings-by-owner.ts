import { usePaginationParams } from "@/features/properties/hooks/use-pagination-params";
import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error-response";
import { Treaty } from "@elysiajs/eden";
import { useSuspenseQuery } from "@tanstack/react-query";

export type ResponseType = Treaty.Data<
    (typeof eden.listings)["by-owner"]["get"]
>;

export type ListingsResponse = ResponseType["items"];

interface UseGetListingsByOwnerProps {
    headers?: HeadersInit;
    page: number;
    pageSize: number;
}

export const getListingsByOwner = async ({
    headers,
    page,
    pageSize,
}: UseGetListingsByOwnerProps) => {
    const { data, error } = await eden.listings["by-owner"].get({
        headers,
        query: { page, pageSize },
    });

    if (error) {
        throw error.value;
    }

    return data;
};

export const useGetListingsByOwner = () => {
    const [params] = usePaginationParams();

    const query = useSuspenseQuery<ResponseType, ErrorResponse>({
        queryKey: ["listings-by-owner"],
        queryFn: () => getListingsByOwner(params),
    });

    return query;
};
