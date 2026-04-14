"use client";

import { EmptyState } from "@/components/empty-state";
import { useGetReservations } from "@/features/reservations/api/use-get-reservations";
import { ReservationsView } from "@/features/reservations/ui/views/reservations-view";

export const Client = () => {
    const {
        data: reservations,
        isLoading: isLoadingReservations,
        isError: isErrorReservations,
        error: errorReservations,
    } = useGetReservations({
        queryType: "by_author",
    });

    if (isLoadingReservations) return <p>Loading...</p>;

    if (isErrorReservations) return <p>{errorReservations.message}</p>;

    if (!reservations || reservations.length === 0) {
        return (
            <EmptyState
                title="No reservations found"
                subtitle="Looks like you have no reservations on your properties."
            />
        );
    }

    return <ReservationsView reservations={reservations} />;
};
