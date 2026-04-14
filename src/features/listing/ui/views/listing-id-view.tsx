import { ResponseType as ListingResponse } from "../../api/use-get-listing";
import { useMemo, useState } from "react";
import { categories } from "@/features/categories/ui/components/category-list";
import { Container } from "@/components/container";
import { ListingHead } from "../components/listing-head";
import { ListingInfo } from "../components/listing-info";
import { useRouter } from "next/navigation";
import { eachDayOfInterval, differenceInCalendarDays } from "date-fns";
import { useCreateReservation } from "@/features/reservations/api/use-create-reservation";
import { ListingReservation } from "../components/listing-reservation";
import { Range } from "react-date-range";
import { toast } from "sonner";
import { ResponseType as ReservationsResponse } from "@/features/reservations/api/use-get-reservations";

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
};

interface ListingIdViewProps {
    reservations?: ReservationsResponse;
    listing: ListingResponse;
}

export const ListingIdView = ({
    listing,
    reservations = [],
}: ListingIdViewProps) => {
    const router = useRouter();

    const disabledDates = useMemo(() => {
        let dates: Date[] = [];

        reservations.forEach((reservation) => {
            const range = eachDayOfInterval({
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate),
            });

            dates = [...dates, ...range];
        });

        return dates;
    }, [reservations]);

    const [dateRange, setDateRange] = useState<Range>(initialDateRange);

    const createReservation = useCreateReservation();

    const category = useMemo(() => {
        return categories.find((item) => item.label === listing.category);
    }, [listing.category]);

    const totalPrice = useMemo(() => {
        if (!dateRange.startDate || !dateRange.endDate) {
            return listing.price;
        }
        const dayCount = differenceInCalendarDays(
            dateRange.endDate,
            dateRange.startDate,
        );

        return dayCount > 0 ? dayCount * listing.price : listing.price;
    }, [dateRange, listing.price]);

    const onCreateReservation = () => {
        if (!dateRange.startDate || !dateRange.endDate) {
            toast.warning("You haven't selected a start or end date");
            return;
        }

        createReservation.mutate(
            {
                totalPrice,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                listingId: listing.id,
            },
            {
                onSuccess: () => {
                    setDateRange(initialDateRange);
                    router.push("/trips");
                },
            },
        );
    };

    return (
        <Container>
            <div className="max-w-screen-5xl mx-auto">
                <div className="flex flex-col gap-6">
                    <ListingHead
                        title={listing.title}
                        imageUrl={listing.imageUrl}
                        locationValue={listing.locationValue}
                        id={listing.id}
                        isFavorited={listing.favorites.length > 0}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
                        <ListingInfo
                            user={listing.user}
                            category={category}
                            description={listing.description}
                            guestCount={listing.guestCount}
                            roomCount={listing.roomCount}
                            bathroomCount={listing.bathroomCount}
                            locationValue={listing.locationValue}
                        />
                        <div className="order-first mb-10 md:order-last md:col-span-3">
                            <ListingReservation
                                price={listing.price}
                                totalPrice={totalPrice}
                                onChangeDate={(value) => setDateRange(value)}
                                dateRange={dateRange}
                                onSubmit={onCreateReservation}
                                disabled={createReservation.isPending}
                                disabledDates={disabledDates}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};
