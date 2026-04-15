import { EmptyState } from "@/components/empty-state";
import { loaderCategoriesFilter } from "@/features/categories/params";
import { getListings } from "@/features/listing/api/use-get-listings";
import {
    ListingsView,
    ListingsViewSkeleton,
} from "@/features/listing/ui/views/listings-view";
import { loaderListingsSearchParams } from "@/features/search/params";
import { loaderListingsSortParams } from "@/features/sort/params";
import { QUERY_LISTINGS } from "@/types/query-type";
import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
    searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: PageProps) => {
    const sq = await searchParams;

    const categoriesFilter = loaderCategoriesFilter(sq);
    const listingsSearch = loaderListingsSearchParams(sq);
    const listingsSort = loaderListingsSortParams(sq);

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: [
            "listings",
            QUERY_LISTINGS.ALL,
            categoriesFilter.category,
            listingsSearch.guestCount,
            listingsSearch.roomCount,
            listingsSearch.bathroomCount,
            listingsSearch.locationValue,
            listingsSearch.startDate,
            listingsSearch.endDate,
            listingsSort.sort,
        ],
        queryFn: () =>
            getListings({
                queryType: "all",
                ...categoriesFilter,
                ...listingsSearch,
                ...listingsSort,
            }),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<ListingsViewSkeleton />}>
                <ErrorBoundary
                    fallback={
                        <EmptyState
                            title="Error!"
                            subtitle="Failed to get listings"
                        />
                    }
                >
                    <ListingsView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
};

export default Page;
