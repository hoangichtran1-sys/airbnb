import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error-response";
import { Treaty } from "@elysiajs/eden";
import { useQuery } from "@tanstack/react-query";

// type ResponseType = Awaited<ReturnType<typeof getListing>>["data"];
export type ResponseType = Treaty.Data<ReturnType<typeof eden.listings>["get"]>;

interface UseGetListingProps {
    listingId: string;
}

export const useGetListing = ({ listingId }: UseGetListingProps) => {
    const query = useQuery<ResponseType, ErrorResponse>({
        queryKey: ["listing", listingId],
        queryFn: async () => {
            const { data, error } = await eden.listings({ listingId }).get();

            if (error) {
                throw error.value;
            }

            console.log(typeof data.createdAt);
            return data;
        },
    });

    return query;
};
