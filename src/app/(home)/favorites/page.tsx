import { requireAuth } from "@/lib/auth-utils";
import { Client } from "./client";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { getListingsFavorite } from "@/features/favorites/api/use-get-listings-favorite";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { EmptyState } from "@/components/empty-state";
import { FavoritesViewSkeleton } from "@/features/favorites/ui/views/favorites-view";
import { headers } from "next/headers";

const Page = async () => {
    await requireAuth();

    const queryClient = new QueryClient();

    const headerList = await headers();

    await queryClient.prefetchQuery({
        queryKey: ["listings-favorite"],
        queryFn: () =>
            getListingsFavorite({
                headers: {
                    cookie: headerList.get("cookie") || "",
                },
            }),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<FavoritesViewSkeleton />}>
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
