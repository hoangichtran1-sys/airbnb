"use client";

import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import {
    ListingCard,
    ListingCardSkeleton,
} from "@/features/listing/ui/components/listing-card";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";
import { useDeleteListing } from "@/features/listing/api/use-delete-listing";
import { useGetListingsByOwner } from "@/features/listing/api/use-get-listings-by-owner";
import { EmptyState } from "@/components/empty-state";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import { Pagination } from "@/components/pagination";

export const PropertiesView = () => {
    const [deletingId, setDeletingId] = useState("");

    const [, setParams] = usePaginationParams();

    const { data: listings, isFetching } = useGetListingsByOwner();

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

    if (listings.items.length === 0) {
        return (
            <EmptyState
                title="No listings found"
                subtitle="Looks like you have no properties."
            />
        );
    }

    return (
        <>
            <RemoveConfirmation />
            <Container>
                <Heading
                    title="Properties"
                    subtitle="List of your properties"
                />
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                    {listings.items.map((listing) => (
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
                <Pagination
                    disabled={isFetching}
                    totalPages={listings.totalPages}
                    page={listings.page}
                    pageSize={listings.pageSize}
                    onPageChange={(page) => setParams({ page })}
                    onPageSizeChange={(pageSize) => setParams({ pageSize })}
                    pageSizeOptions={[5, 10, 20, 50, 100]}
                />
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
