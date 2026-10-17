import { getListing } from "@/features/listing/api/use-get-listing";
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
import { ListingIdViewSkeleton } from "@/features/listing/ui/views/listing-id-view";
import { EmptyState } from "@/components/empty-state";
import { headers } from "next/headers";

interface PageProps {
    params: Promise<{
        listingId: string;
    }>;
}

const Page = async ({ params }: PageProps) => {
    const { listingId } = await params;

    const queryClient = new QueryClient();

    const headerList = await headers();

    await queryClient.prefetchQuery({
        queryKey: ["listing", listingId],
        queryFn: () =>
            getListing({
                listingId,
                headers: {
                    cookie: headerList.get("cookie") || "",
                },
            }),
    });

    await queryClient.prefetchQuery({
        queryKey: ["reservations", listingId, QUERY_RESERVATIONS.BY_LISTING],
        queryFn: () => getReservations({ queryType: "by_listing", listingId }),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<ListingIdViewSkeleton />}>
                <ErrorBoundary
                    fallback={
                        <EmptyState
                            title="Error!"
                            subtitle="Failed to get data"
                        />
                    }
                >
                    <Client listingId={listingId} />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
};

export default Page;
