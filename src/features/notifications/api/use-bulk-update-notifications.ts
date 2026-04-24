import { eden } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Treaty } from "@elysiajs/eden";
import { ErrorResponse } from "@/types/error-response";
import { toast } from "sonner";

type ResponseType = Treaty.Data<
    (typeof eden.notifications)["bulk-update"]["post"]
>;
type RequestType = { notificationIds: string[] };

export const useBulkUpdateNotifications = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
        mutationFn: async ({ notificationIds }) => {
            const { data, error } = await eden.notifications[
                "bulk-update"
            ].post({ notificationIds });

            if (error) {
                throw error.value;
            }

            return data;
        },
        onSuccess: (data) => {
            toast.success(`${data.count} notifications updated`);
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};
