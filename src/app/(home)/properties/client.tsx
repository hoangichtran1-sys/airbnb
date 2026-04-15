"use client";

import { EmptyState } from "@/components/empty-state";
import { useGetListings } from "@/features/listing/api/use-get-listings";
import { PropertiesView } from "@/features/properties/ui/views/properties-view";

export const Client = () => {
    const { data: listings } = useGetListings({ queryType: "by_user" });

    if (listings.length === 0) {
        return (
            <EmptyState
                title="No listings found"
                subtitle="Looks like you have no properties."
            />
        );
    }

    return <PropertiesView listings={listings} />;
};
