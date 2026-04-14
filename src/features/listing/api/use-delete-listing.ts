import { eden } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Treaty } from "@elysiajs/eden";
import { ErrorResponse } from "@/types/error-response";
import { toast } from "sonner";

type ResponseType = Treaty.Data<ReturnType<typeof eden.listings>["delete"]>;
type RequestType = { listingId: string };

export const useDeleteListing = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
        mutationFn: async ({ listingId }) => {
            const { data, error } = await eden.listings({ listingId }).delete();

            if (error) {
                throw error.value;
            }

            return data;
        },
        onSuccess: () => {
            toast.success("Listing deleted");
            queryClient.invalidateQueries({ queryKey: ["listings"] });
            queryClient.invalidateQueries({ queryKey: ["listings-favorite"] });
            queryClient.invalidateQueries({
                queryKey: ["reservations"],
            });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};
