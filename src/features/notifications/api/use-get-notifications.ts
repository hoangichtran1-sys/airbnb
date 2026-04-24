import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error-response";
import { Treaty } from "@elysiajs/eden";
import { useQuery } from "@tanstack/react-query";

// type ResponseType = Awaited<ReturnType<typeof getListing>>["data"];
export type ResponseType = Treaty.Data<typeof eden.notifications.get>;

export const getNotifications = async () => {
    const { data, error } = await eden.notifications.get();

    if (error) {
        throw error.value;
    }

    return data;
};

export const useGetNotifications = () => {
    const query = useQuery<ResponseType, ErrorResponse>({
        queryKey: ["notifications"],
        queryFn: getNotifications,
        refetchInterval: 30000
    });

    return query;
};
