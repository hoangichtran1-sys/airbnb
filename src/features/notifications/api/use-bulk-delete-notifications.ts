import { eden } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Treaty } from "@elysiajs/eden";
import { ErrorResponse } from "@/types/error-response";
import { toast } from "sonner";

type ResponseType = Treaty.Data<
    (typeof eden.notifications)["bulk-delete"]["post"]
>;
type RequestType = { notificationIds: string[] };

export const useBulkDeleteNotifications = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
        mutationFn: async ({ notificationIds }) => {
            const { data, error } = await eden.notifications[
                "bulk-delete"
            ].post({ notificationIds });

            if (error) {
                throw error.value;
            }

            return data;
        },
        onSuccess: (data) => {
            toast.success(`${data.count} notifications deleted`);
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};
