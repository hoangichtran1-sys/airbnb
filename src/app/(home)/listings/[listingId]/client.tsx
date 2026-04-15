"use client";

import { useGetListing } from "@/features/listing/api/use-get-listing";
import { useGetReservations } from "@/features/reservations/api/use-get-reservations";
import { ListingIdView } from "@/features/listing/ui/views/listing-id-view";

interface ClientProps {
    listingId: string;
}

export const Client = ({ listingId }: ClientProps) => {
    const { data: listing } = useGetListing({ listingId });

    const { data: reservations } = useGetReservations({
        listingId,
        queryType: "by_listing",
    });

    return <ListingIdView listing={listing} reservations={reservations} />;
};
