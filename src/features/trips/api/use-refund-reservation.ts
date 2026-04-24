import { eden } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { Treaty } from "@elysiajs/eden";
import { ErrorResponse } from "@/types/error-response";
import { toast } from "sonner";

type ResponseType = Treaty.Data<
    ReturnType<typeof eden.reservations.refund>["post"]
>;
type RequestType = { reservationId: string, role: "customer" | "vendor" };

export const useRefundReservation = () => {
    const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
        mutationFn: async ({ reservationId, role }) => {
            const { data, error } = await eden.reservations
                .refund({ reservationId })
                .post({ role });

            if (error) {
                throw error.value;
            }

            return data;
        },
        onSuccess: (data) => {
            toast.success(data.message);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};
