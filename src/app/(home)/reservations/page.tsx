import { requireAuth } from "@/lib/auth-utils";
import { Client } from "./client";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { QUERY_RESERVATIONS } from "@/types/query-type";
import { getReservations } from "@/features/reservations/api/use-get-reservations";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ReservationsViewSkeleton } from "@/features/reservations/ui/views/reservations-view";
import { EmptyState } from "@/components/empty-state";
import { headers } from "next/headers";

const Page = async () => {
    await requireAuth();

    const queryClient = new QueryClient();
    const headerList = await headers();

    await queryClient.prefetchQuery({
        queryKey: ["reservations", undefined, QUERY_RESERVATIONS.BY_AUTHOR],
        queryFn: () =>
            getReservations({
                queryType: "by_author",
                headers: {
                    cookie: headerList.get("cookie") || "",
                },
            }),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<ReservationsViewSkeleton />}>
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
