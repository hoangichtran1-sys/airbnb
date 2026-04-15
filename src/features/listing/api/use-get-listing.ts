import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error-response";
import { Treaty } from "@elysiajs/eden";
import { useSuspenseQuery } from "@tanstack/react-query";

// type ResponseType = Awaited<ReturnType<typeof getListing>>["data"];
export type ResponseType = Treaty.Data<ReturnType<typeof eden.listings>["get"]>;

interface UseGetListingProps {
    listingId: string;
}

export const getListing = async ({ listingId }: UseGetListingProps) => {
    const { data, error } = await eden.listings({ listingId }).get();

    if (error) {
        throw error.value;
    }

    return data;
};

export const useGetListing = ({ listingId }: UseGetListingProps) => {
    const query = useSuspenseQuery<ResponseType, ErrorResponse>({
        queryKey: ["listing", listingId],
        queryFn: () => getListing({ listingId }),
    });

    return query;
};
