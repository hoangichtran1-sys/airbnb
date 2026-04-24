"use client";

import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import {
    ListingCard,
    ListingCardSkeleton,
} from "@/features/listing/ui/components/listing-card";
import { useCancelReservation } from "@/features/reservations/api/use-cancel-reservation";
import { ResponseType as ReservationsResponse } from "@/features/reservations/api/use-get-reservations";
import { useRefundReservation } from "@/features/trips/api/use-refund-reservation";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";

interface ReservationsViewProps {
    reservations: ReservationsResponse;
}

export const ReservationsView = ({ reservations }: ReservationsViewProps) => {
    const [deletingId, setDeletingId] = useState("");
    const [refundId, setRefundId] = useState("");

    const cancelReservation = useCancelReservation();
    const refundReservation = useRefundReservation();

    const [CancelConfirmation, confirmCancel] = useConfirm(
        "Are you sure?",
        "The following action will permanently cancel this reservation",
    );

    const onCancel = async (id: string) => {
        const ok = await confirmCancel();
        if (!ok) return;

        setDeletingId(id);
        await cancelReservation.mutateAsync(
            { reservationId: id },
            {
                onSuccess: () => {
                    setDeletingId("");
                },
            },
        );
    };

    const onRefund = (id: string) => {
        setRefundId(id);
        refundReservation.mutate(
            { reservationId: id, role: "vendor" },
            {
                onSuccess: () => {
                    setRefundId("");
                },
            },
        );
    };

    return (
        <>
            <CancelConfirmation />
            <Container>
                <Heading
                    title="Reservations"
                    subtitle="Bookings on your properties"
                />
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 ">
                    {reservations.map((reservation) => (
                        <ListingCard
                            key={reservation.id}
                            data={reservation.listing}
                            reservation={reservation}
                            actionId={reservation.id}
                            onAction={onCancel}
                            disabled={
                                deletingId === reservation.id ||
                                refundId === reservation.id
                            }
                            actionLabel="Cancel guest reservation"
                            onRefund={onRefund}
                            role="vendor"
                        />
                    ))}
                </div>
            </Container>
        </>
    );
};

export const ReservationsViewSkeleton = () => {
    return (
        <Container>
            <Heading
                title="Reservations"
                subtitle="Bookings on your properties"
            />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                    <ListingCardSkeleton hasAction key={i} />
                ))}
            </div>
        </Container>
    );
};
