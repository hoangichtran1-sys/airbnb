"use client";

import { EmptyState } from "@/components/empty-state";
import { useGetListingsFavorite } from "@/features/favorites/api/use-get-listings-favorite";
import { FavoritesView } from "@/features/favorites/ui/views/favorites-view";

export const Client = () => {
    const {
        data: listingsFavorite,
        isLoading,
        isError,
        error,
    } = useGetListingsFavorite();

    if (isLoading) return <p>Loading...</p>;

    if (isError) return <p>{error.message}</p>;

    if (!listingsFavorite || listingsFavorite.length === 0) {
        return (
            <EmptyState
                title="No favorites found"
                subtitle="Looks like you have no favorites listings."
            />
        );
    }

    return <FavoritesView listingsFavorite={listingsFavorite} />;
};
