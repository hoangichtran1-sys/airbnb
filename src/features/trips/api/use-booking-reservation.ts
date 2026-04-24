import { eden } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { Treaty } from "@elysiajs/eden";
import { ErrorResponse } from "@/types/error-response";
import { toast } from "sonner";
import { useCheckoutStates } from "../hooks/use-checkout-state";

type ResponseType = Treaty.Data<
    ReturnType<typeof eden.reservations.booking>["post"]
>;
type RequestType = { reservationId: string };

export const useBookingReservation = () => {
    const [, setStates] = useCheckoutStates();

    const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
        mutationFn: async ({ reservationId }) => {
            const { data, error } = await eden.reservations
                .booking({ reservationId })
                .post();

            if (error) {
                throw error.value;
            }

            return data;
        },
        onMutate: () => {
            setStates({ success: false, cancel: false });
        },
        onSuccess: (data) => {
            toast.success("Checkout session created");
            window.location.href = data.url;
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};
