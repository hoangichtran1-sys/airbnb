"use client";

import { Container } from "@/components/container";
import { useGetListings } from "../../api/use-get-listings";
import { EmptyState } from "@/components/empty-state";
import { useCategoriesFilter } from "@/features/categories/hooks/use-categories-filter";
import { ListingCard } from "../components/listing-card";
import { useListingsSearch } from "@/features/search/hooks/use-listings-search";
import { useListingsSort } from "@/features/sort/hooks/use-listings-sort";

export const ListingsView = () => {
    const [filterCategories] = useCategoriesFilter();
    const [searchValues] = useListingsSearch();
    const [sortValue] = useListingsSort();

    const {
        data: listings,
        error,
        isError,
        isLoading,
    } = useGetListings({
        ...filterCategories,
        ...searchValues,
        ...sortValue,
    });

    if (isLoading) return <p>Loading...</p>;

    if (isError) return <p>{error.message}</p>;

    if (!listings || listings.length === 0) {
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
