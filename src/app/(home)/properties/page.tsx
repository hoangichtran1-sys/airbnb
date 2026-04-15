import { requireAuth } from "@/lib/auth-utils";
import { Client } from "./client";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { getListings } from "@/features/listing/api/use-get-listings";
import { QUERY_LISTINGS } from "@/types/query-type";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { EmptyState } from "@/components/empty-state";
import { PropertiesViewSkeleton } from "@/features/properties/ui/views/properties-view";
import { headers } from "next/headers";

const Page = async () => {
    await requireAuth();

    const queryClient = new QueryClient();

    const headerList = await headers();

    await queryClient.prefetchQuery({
        queryKey: ["listings", QUERY_LISTINGS.BY_USER],
        queryFn: () =>
            getListings({
                queryType: "by_user",
                headers: {
                    cookie: headerList.get("cookie") || "",
                },
            }),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<PropertiesViewSkeleton />}>
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
