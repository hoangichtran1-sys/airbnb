import { requireAuth } from "@/lib/auth-utils";
import { Client } from "./client";
import {
    HydrationBoundary,
    dehydrate,
    QueryClient,
} from "@tanstack/react-query";
import { eden } from "@/lib/rpc";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QUERY_RESERVATIONS } from "@/types/query-type";

const Page = async () => {
    await requireAuth();

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["reservations", undefined, QUERY_RESERVATIONS.BY_USER],
        queryFn: async () => {
            const { data, error } = await eden.reservations.get({
                query: { queryType: "by_user" },
            });

            if (error) throw error.value;

            return data;
        },
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<p>Loading...</p>}>
                <ErrorBoundary fallback={<p>Error!</p>}>
                    <Client />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
};

export default Page;
