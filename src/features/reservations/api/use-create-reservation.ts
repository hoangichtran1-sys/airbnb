import { eden } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Static } from "elysia";
import { Treaty } from "@elysiajs/eden";
import { ErrorResponse } from "@/types/error-response";
import { toast } from "sonner";
import { reservationCreateSchema } from "../schemas";
import { useLoginModal } from "@/features/auth/hooks/use-login-modal";
import { ErrorCode } from "@/enums/error-code";

type ResponseType = Treaty.Data<typeof eden.reservations.post>;
type RequestType = Static<typeof reservationCreateSchema>;

export const useCreateReservation = () => {
    const { onOpenLoginModal } = useLoginModal();

    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
        mutationFn: async (body) => {
            const { data, error } = await eden.reservations.post(body);

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
            toast.success("Listing reserved!");
            queryClient.invalidateQueries({ queryKey: ["listings"] });
            queryClient.invalidateQueries({
                queryKey: ["reservations"],
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
