import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error-response";
import { Treaty } from "@elysiajs/eden";
import { useQuery } from "@tanstack/react-query";

// type ResponseType = Awaited<ReturnType<typeof getListing>>["data"];
export type ResponseType = Treaty.Data<typeof eden.listings["search-with-title"]["get"]>;


export const getListingsSearchWithTitle = async () => {
    const { data, error } = await eden.listings["search-with-title"].get();

    if (error) {
        throw error.value;
    }

    return data;
};

export const useGetListingsSearchWithTitle = () => {
    const query = useQuery<ResponseType, ErrorResponse>({
        queryKey: ["listings-search-with-title"],
        queryFn: getListingsSearchWithTitle,
    });

    return query;
};
