import { Reservation } from "@/generated/prisma/client";
import { useRouter } from "next/navigation";
import { useCountries } from "../../hooks/use-countries";
import { useMemo } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { HeartButton } from "@/features/favorites/ui/components/heart-button";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ResponseType as ListingsResponse } from "../../api/use-get-listings";
import { AiFillHeart } from "react-icons/ai";

interface ListingCardProps {
    data: ListingsResponse[number];
    reservation?: Reservation;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
}

export const ListingCard = ({
    data,
    reservation,
    onAction,
    disabled,
    actionLabel,
    actionId = "",
}: ListingCardProps) => {
    const router = useRouter();
    const { getByValue } = useCountries();

    const location = getByValue(data.locationValue);

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (disabled) {
            return;
        }

        onAction?.(actionId);
    };

    const price = useMemo(() => {
        if (reservation) {
            return reservation.totalPrice;
        }

        return data.price;
    }, [reservation, data.price]);

    const reservationData = useMemo(() => {
        if (!reservation) return;

        const start = new Date(reservation.startDate);
        const end = new Date(reservation.endDate);

        return `${format(start, "PP")} - ${format(end, "PP")}`;
    }, [reservation]);

    return (
        <div
            onClick={() => router.push(`/listings/${data.id}`)}
            className="col-span-1 cursor-pointer group"
        >
            <div className="flex flex-col gap-2 w-full">
                <div className="aspect-square w-full relative overflow-hidden rounded-xl">
                    <Image
                        alt={data.title}
                        src={data.imageUrl}
                        className="object-cover h-full w-full group-hover:scale-110 transition"
                        fill
                        loading="eager"
                    />
                    <div className="absolute top-3 right-3">
                        <HeartButton
                            isFavorited={data.favorites?.length > 0}
                            listingId={data.id}
                        />
                    </div>
                </div>
                <div className="font-semibold text-lg">
                    <div className="flex flex-row items-center justify-between gap-2">
                        <p>
                            {location?.region}, {location?.label}
                        </p>
                        {!onAction && !actionLabel && (
                            <p className="text-neutral-600">
                                {data._count.favorites}{" "}
                                <AiFillHeart className="fill-rose-500 size-3" />
                            </p>
                        )}
                    </div>
                </div>
                <div className="font-light text-neutral-500">
                    {reservationData || data.category}
                </div>
                <div className="flex flex-row items-center gap-1">
                    <div className="font-semibold">{formatPrice(price)}</div>
                    {!reservation && <div className="font-light">/ night</div>}
                </div>
                {onAction && actionLabel && (
                    <Button
                        onClick={handleCancel}
                        size="sm"
                        variant="tertiary"
                        disabled={disabled}
                    >
                        {actionLabel}
                    </Button>
                )}
            </div>
        </div>
    );
};
