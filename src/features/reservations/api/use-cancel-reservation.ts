import { eden } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Treaty } from "@elysiajs/eden";
import { ErrorResponse } from "@/types/error-response";
import { toast } from "sonner";

type ResponseType = Treaty.Data<ReturnType<typeof eden.reservations>["delete"]>;
type RequestType = { reservationId: string };

export const useCancelReservation = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
        mutationFn: async ({ reservationId }) => {
            const { data, error } = await eden
                .reservations({ reservationId })
                .delete();

            if (error) {
                throw error.value;
            }

            return data;
        },
        onSuccess: () => {
            toast.success("Reservation canceled");
            queryClient.invalidateQueries({ queryKey: ["listings"] });
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
