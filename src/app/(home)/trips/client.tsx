"use client";

import { EmptyState } from "@/components/empty-state";
import { useGetReservations } from "@/features/reservations/api/use-get-reservations";
import { TripsView } from "@/features/trips/ui/views/trips-view";

export const Client = () => {
    const { data: reservations } = useGetReservations({
        queryType: "by_user",
    });

    if (reservations.length === 0) {
        return (
            <EmptyState
                title="No trips found"
                subtitle="Looks like you haven't reserved any trips."
            />
        );
    }

    return <TripsView reservations={reservations} />;
};