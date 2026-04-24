"use client";

import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import {
    ListingCard,
    ListingCardSkeleton,
} from "@/features/listing/ui/components/listing-card";
import { useCancelReservation } from "@/features/reservations/api/use-cancel-reservation";
import { ResponseType as ReservationsResponse } from "@/features/reservations/api/use-get-reservations";
import { useConfirm } from "@/hooks/use-confirm";
import { useEffect, useState } from "react";
import { useBookingReservation } from "../../api/use-booking-reservation";
import { useRefundReservation } from "../../api/use-refund-reservation";
import { useCheckoutStates } from "../../hooks/use-checkout-state";
import { toast } from "sonner";
import { useConfettiStore } from "../../hooks/use-confetti-store";

interface TripsViewProps {
    reservations: ReservationsResponse;
}

export const TripsView = ({ reservations }: TripsViewProps) => {
    const [deletingId, setDeletingId] = useState("");
    const [bookingId, setBookingId] = useState("");
    const [refundId, setRefundId] = useState("");

    const [states, setStates] = useCheckoutStates();
    const { onOpenConfetti } = useConfettiStore();

    const cancelReservation = useCancelReservation();
    const bookingReservation = useBookingReservation();
    const refundReservation = useRefundReservation();

    const [CancelConfirmation, confirmCancel] = useConfirm(
        "Are you sure?",
        "The following action will permanently cancel this reservation",
    );

    const [RefundConfirmation, confirmRefund] = useConfirm(
        "Are you sure?",
        "The following action will permanently refund this reservation",
    );

    useEffect(() => {
        if (states.success) {
            setStates({ success: false, cancel: false });
            onOpenConfetti();
            toast.success("Success", {
                description: "Checkout completed",
                position: "top-right",
            });
        }
        if (states.cancel) {
            setStates({ success: false, cancel: false });
            toast.error("Error", {
                description: "Checkout cancel. Please try again",
                position: "top-right",
            });
        }
    }, [states.success, states.cancel, setStates, onOpenConfetti]);

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

    const onBooking = (id: string) => {
        setBookingId(id);
        bookingReservation.mutate(
            { reservationId: id },
            {
                onSuccess: () => {
                    setBookingId("");
                },
            },
        );
    };

    const onRefund = async (id: string) => {
        const ok = await confirmRefund();
        if (!ok) return;

        setRefundId(id);
        await refundReservation.mutateAsync(
            { reservationId: id, role: "customer" },
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
            <RefundConfirmation />
            <Container>
                <Heading
                    title="Trips"
                    subtitle="Where you've been and where you're going"
                />
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                    {reservations.map((reservation) => (
                        <ListingCard
                            key={reservation.id}
                            data={reservation.listing}
                            reservation={reservation}
                            actionId={reservation.id}
                            onAction={onCancel}
                            disabled={
                                deletingId === reservation.id ||
                                bookingId === reservation.id ||
                                refundId === reservation.id
                            }
                            actionLabel="Cancel reservation"
                            onCheckout={onBooking}
                            onRefund={onRefund}
                            role="customer"
                        />
                    ))}
                </div>
            </Container>
        </>
    );
};

export const TripsViewSkeleton = () => {
    return (
        <Container>
            <Heading
                title="Trips"
                subtitle="Where you've been and where you're going"
            />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                    <ListingCardSkeleton hasAction key={i} />
                ))}
            </div>
        </Container>
    );
};
