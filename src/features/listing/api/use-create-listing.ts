import { eden } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Static } from "elysia";
import { listingCreateSchema } from "../schemas";
import { Treaty } from "@elysiajs/eden";
import { ErrorResponse } from "@/types/error-response";
import { toast } from "sonner";

type ResponseType = Treaty.Data<typeof eden.listings.rent.post>;
type RequestType = Static<typeof listingCreateSchema>;

export const useCreateListing = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
        mutationFn: async (body) => {
            const { data, error } = await eden.listings.rent.post(body);

            if (error) {
                if (error.value.type === "validation") {
                    throw {
                        message: "Invalid fields input",
                        code: "VALIDATION_ERROR",
                    } satisfies ErrorResponse;
                }
                throw error.value;
            }

            return data;
        },
        onSuccess: () => {
            toast.success("Listing created");
            queryClient.invalidateQueries({ queryKey: ["listings"] });
            queryClient.invalidateQueries({ queryKey: ["listings-by-owner"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};
