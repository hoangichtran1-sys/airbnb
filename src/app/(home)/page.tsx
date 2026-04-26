import { EmptyState } from "@/components/empty-state";
import { DEFAULT_LIMIT } from "@/constant";
import { loaderCategoriesFilter } from "@/features/categories/params";
import { getListings } from "@/features/listing/api/use-get-listings";
import {
    ListingsView,
    ListingsViewSkeleton,
} from "@/features/listing/ui/views/listings-view";
import { loaderListingsSearchParams } from "@/features/search/params";
import { loaderListingsSortParams } from "@/features/sort/params";
import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from "@tanstack/react-query";
import { headers } from "next/headers";
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

    const headerList = await headers();

    const queryClient = new QueryClient();

    await queryClient.prefetchInfiniteQuery({
        queryKey: [
            "listings",
            categoriesFilter.category,
            listingsSearch.guestCount,
            listingsSearch.roomCount,
            listingsSearch.bathroomCount,
            listingsSearch.bedroomCount,
            listingsSearch.locationValue,
            listingsSearch.startDate,
            listingsSearch.endDate,
            listingsSort.sort,
            DEFAULT_LIMIT,
        ],
        queryFn: ({ pageParam }) =>
            getListings({
                ...categoriesFilter,
                ...listingsSearch,
                ...listingsSort,
                headers: {
                    cookie: headerList.get("cookie") || "",
                },
                limit: DEFAULT_LIMIT,
                cursor: pageParam ?? undefined,
            }),
        initialPageParam: undefined,
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
