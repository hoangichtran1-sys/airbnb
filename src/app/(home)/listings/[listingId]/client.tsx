"use client";

import { EmptyState } from "@/components/empty-state";
import { useGetListing } from "@/features/listing/api/use-get-listing";
import { useGetReservations } from "@/features/reservations/api/use-get-reservations";
import { ListingIdView } from "@/features/listing/ui/views/listing-id-view";

interface ClientProps {
    listingId: string;
}

export const Client = ({ listingId }: ClientProps) => {
    const {
        data: listing,
        isLoading: isLoadingListing,
        isError: isErrorListing,
        error: errorListing,
    } = useGetListing({ listingId });

    const {
        data: reservations,
        isLoading: isLoadingReservations,
        isError: isErrorReservations,
        error: errorReservations,
    } = useGetReservations({
        listingId,
        queryType: "by_listing",
    });

    const isLoading = isLoadingListing || isLoadingReservations;

    if (isLoading) return <p>Loading...</p>;

    if (isErrorListing) return <p>{errorListing.message}</p>;

    if (isErrorReservations) return <p>{errorReservations.message}</p>;

    if (!listing) {
        return <EmptyState title="No listing found" />;
    }

    return <ListingIdView listing={listing} reservations={reservations} />;
};
