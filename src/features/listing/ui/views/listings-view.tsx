"use client";

import { Container } from "@/components/container";
import { useGetListings } from "../../api/use-get-listings";
import { useCategoriesFilter } from "@/features/categories/hooks/use-categories-filter";
import { ListingCard, ListingCardSkeleton } from "../components/listing-card";
import { useListingsSearch } from "@/features/search/hooks/use-listings-search";
import { useListingsSort } from "@/features/sort/hooks/use-listings-sort";
import { DEFAULT_LIMIT } from "@/constant";
import { InfiniteScroll } from "@/components/infinite-scroll";

export const ListingsView = () => {
    const [filterCategories] = useCategoriesFilter();
    const [searchValues] = useListingsSearch();
    const [sortValue] = useListingsSort();

    const {
        data: listings,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useGetListings({
        ...filterCategories,
        ...searchValues,
        ...sortValue,
        limit: DEFAULT_LIMIT,
    });

    return (
        <Container>
            <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {listings.pages
                    .flatMap((page) => page.items)
                    .map((listing) => (
                        <ListingCard key={listing.id} data={listing} />
                    ))}
            </div>
            <InfiniteScroll
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                isManual={false}
            />
        </Container>
    );
};

export const ListingsViewSkeleton = () => {
    return (
        <Container>
            <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {Array.from({ length: 12 }).map((_, i) => (
                    <ListingCardSkeleton key={i} />
                ))}
            </div>
        </Container>
    );
};
