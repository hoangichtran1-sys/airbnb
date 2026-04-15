"use client";

import { EmptyState } from "@/components/empty-state";
import { useGetListingsFavorite } from "@/features/favorites/api/use-get-listings-favorite";
import { FavoritesView } from "@/features/favorites/ui/views/favorites-view";

export const Client = () => {
    const { data: listingsFavorite } = useGetListingsFavorite();

    if (listingsFavorite.length === 0) {
        return (
            <EmptyState
                title="No favorites found"
                subtitle="Looks like you have no favorites listings."
            />
        );
    }

    return <FavoritesView listingsFavorite={listingsFavorite} />;
};
