import { requireAuth } from "@/lib/auth-utils";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { EmptyState } from "@/components/empty-state";
import {
    PropertiesView,
    PropertiesViewSkeleton,
} from "@/features/properties/ui/views/properties-view";
import { headers } from "next/headers";
import { getListingsByOwner } from "@/features/listing/api/use-get-listings-by-owner";
import { SearchParams } from "nuqs/server";
import { paginationParamsLoader } from "@/features/properties/params";

interface PageProps {
    paginationParams: Promise<SearchParams>;
}

const Page = async ({ paginationParams }: PageProps) => {
    await requireAuth();

    const params = await paginationParamsLoader(paginationParams);

    const queryClient = new QueryClient();

    const headerList = await headers();

    await queryClient.prefetchQuery({
        queryKey: ["listings-by-owner"],
        queryFn: () =>
            getListingsByOwner({
                headers: {
                    cookie: headerList.get("cookie") || "",
                },
                ...params,
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
                    <PropertiesView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
};

export default Page;
