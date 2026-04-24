import { Client } from "./client";
import {
    HydrationBoundary,
    dehydrate,
    QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QUERY_RESERVATIONS } from "@/types/query-type";
import { getReservations } from "@/features/reservations/api/use-get-reservations";
import { EmptyState } from "@/components/empty-state";
import { TripsViewSkeleton } from "@/features/trips/ui/views/trips-view";
import { headers } from "next/headers";

const Page = async () => {
    const queryClient = new QueryClient();
    const headerList = await headers();

    await queryClient.prefetchQuery({
        queryKey: ["reservations", undefined, QUERY_RESERVATIONS.BY_USER],
        queryFn: () =>
            getReservations({
                queryType: "by_user",
                headers: {
                    cookie: headerList.get("cookie") || "",
                },
            }),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<TripsViewSkeleton />}>
                <ErrorBoundary
                    fallback={
                        <EmptyState
                            title="Error!"
                            subtitle="Failed to get listings"
                        />
                    }
                >
                    <Client />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
};

export default Page;
