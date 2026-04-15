"use client";

import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import {
    ListingCard,
    ListingCardSkeleton,
} from "@/features/listing/ui/components/listing-card";
import { ResponseType as ListingsResponse } from "@/features/listing/api/use-get-listings";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";
import { useDeleteListing } from "@/features/listing/api/use-delete-listing";

interface PropertiesViewProps {
    listings: ListingsResponse;
}

export const PropertiesView = ({ listings }: PropertiesViewProps) => {
    const [deletingId, setDeletingId] = useState("");

    const removeListing = useDeleteListing();

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you sure?",
        "The following action will permanently remove this listing",
    );

    const onRemove = async (id: string) => {
        const ok = await confirmRemove();
        if (!ok) return;

        setDeletingId(id);
        await removeListing.mutateAsync(
            { listingId: id },
            {
                onSuccess: () => {
                    setDeletingId("");
                },
            },
        );
    };

    return (
        <>
            <RemoveConfirmation />
            <Container>
                <Heading
                    title="Properties"
                    subtitle="List of your properties"
                />
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                    {listings.map((listing) => (
                        <ListingCard
                            key={listing.id}
                            data={listing}
                            actionId={listing.id}
                            onAction={onRemove}
                            disabled={deletingId === listing.id}
                            actionLabel="Remove listing"
                        />
                    ))}
                </div>
            </Container>
        </>
    );
};

export const PropertiesViewSkeleton = () => {
    return (
        <Container>
            <Heading title="Properties" subtitle="List of your properties" />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                    <ListingCardSkeleton hasAction key={i} />
                ))}
            </div>
        </Container>
    );
};
