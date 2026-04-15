"use client";

import { EmptyState } from "@/components/empty-state";
import { useGetReservations } from "@/features/reservations/api/use-get-reservations";
import { ReservationsView } from "@/features/reservations/ui/views/reservations-view";

export const Client = () => {
    const { data: reservations } = useGetReservations({
        queryType: "by_author",
    });

    if (reservations.length === 0) {
        return (
            <EmptyState
                title="No reservations found"
                subtitle="Looks like you have no reservations on your properties."
            />
        );
    }

    return <ReservationsView reservations={reservations} />;
};
