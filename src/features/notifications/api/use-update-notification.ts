import { eden } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Treaty } from "@elysiajs/eden";
import { ErrorResponse } from "@/types/error-response";
import { toast } from "sonner";

type ResponseType = Treaty.Data<ReturnType<typeof eden.notifications>["put"]>;
type RequestType = { notificationId: string };

export const useUpdateNotification = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
        mutationFn: async ({ notificationId }) => {
            const { data, error } = await eden
                .notifications({ notificationId })
                .put();

            if (error) {
                throw error.value;
            }

            return data;
        },
        onSuccess: () => {
            toast.success("Notification updated");
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};
