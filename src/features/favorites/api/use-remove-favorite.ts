import { ErrorCode } from "@/enums/error-code";
import { useLoginModal } from "@/features/auth/hooks/use-login-modal";
import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error-response";
import { Treaty } from "@elysiajs/eden";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type ResponseType = Treaty.Data<
    (typeof eden.favorites)["remove-listing"]["post"]
>;
type RequestType = { listingId: string };

export const useRemoveFavorite = () => {
    const { onOpenLoginModal } = useLoginModal();
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
        mutationFn: async ({ listingId }) => {
            const { data, error } = await eden.favorites["remove-listing"][
                "post"
            ]({ listingId });

            if (error) {
                throw error.value;
            }

            return data;
        },
        onSuccess: (data) => {
            toast.success("Added this favorite for listing");
            queryClient.invalidateQueries({ queryKey: ["listings"] });
            queryClient.invalidateQueries({ queryKey: ["listings-favorite"] });
            queryClient.invalidateQueries({
                queryKey: ["listing", data.listingId],
            });
        },
        onError: (error) => {
            if (error.code === ErrorCode.UNAUTHORIZED) {
                onOpenLoginModal();
            }
            toast.error(error.message);
        },
    });

    return mutation;
};
