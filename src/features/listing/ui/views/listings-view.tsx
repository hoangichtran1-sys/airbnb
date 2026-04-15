"use client";

import { Container } from "@/components/container";
import { useGetListings } from "../../api/use-get-listings";
import { EmptyState } from "@/components/empty-state";
import { useCategoriesFilter } from "@/features/categories/hooks/use-categories-filter";
import { ListingCard, ListingCardSkeleton } from "../components/listing-card";
import { useListingsSearch } from "@/features/search/hooks/use-listings-search";
import { useListingsSort } from "@/features/sort/hooks/use-listings-sort";

export const ListingsView = () => {
    const [filterCategories] = useCategoriesFilter();
    const [searchValues] = useListingsSearch();
    const [sortValue] = useListingsSort();

    const { data: listings } = useGetListings({
        ...filterCategories,
        ...searchValues,
        ...sortValue,
        queryType: "all",
    });

    if (listings.length === 0) {
        return <EmptyState title="No listings found" showReset />;
    }

    return (
        <Container>
            <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {listings.map((listing) => (
                    <ListingCard key={listing.id} data={listing} />
                ))}
            </div>
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
