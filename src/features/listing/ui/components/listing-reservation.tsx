import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { Range } from "react-date-range";
import { Calendar } from "./calendar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ListingReservationProps {
    price: number;
    totalPrice: number;
    onChangeDate: (value: Range) => void;
    dateRange: Range;
    onSubmit: () => void;
    disabled?: boolean;
    disabledDates: Date[];
}

export const ListingReservation = ({
    price,
    totalPrice,
    onChangeDate,
    dateRange,
    onSubmit,
    disabled,
    disabledDates,
}: ListingReservationProps) => {
    return (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="flex flex-row items-center gap-1 p-4">
                <p className="text-2xl font-semibold">{formatPrice(price)}</p>
                <span className="font-light text-neutral-600">/ night</span>
            </div>
            <Separator />
            <Calendar
                value={dateRange}
                disabledDates={disabledDates}
                onChange={(value) => onChangeDate(value.selection)}
            />
            <Separator />
            <div className="p-4">
                <Button
                    onClick={onSubmit}
                    variant="tertiary"
                    disabled={disabled}
                    className="w-full"
                >
                    Reserve
                </Button>
            </div>
            <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
                <p>Total</p>
                <p>{formatPrice(totalPrice)}</p>
            </div>
        </div>
    );
};

export const ListingReservationSkeleton = () => {
    return (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            {/* PRICE */}
            <div className="flex items-center gap-2 p-4">
                <Skeleton className="h-7 w-25" />
                <Skeleton className="h-4 w-15" />
            </div>

            <Separator />

            {/* CALENDAR */}
            <div className="p-4 space-y-3">
                {/* Calendar header */}
                <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-30" />
                    <Skeleton className="h-4 w-15" />
                </div>

                {/* Calendar grid (fake) */}
                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 35 }).map((_, i) => (
                        <Skeleton key={i} className="h-8 w-full rounded-md" />
                    ))}
                </div>
            </div>

            <Separator />

            {/* BUTTON */}
            <div className="p-4">
                <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* TOTAL */}
            <div className="p-4 flex items-center justify-between">
                <Skeleton className="h-5 w-15" />
                <Skeleton className="h-5 w-25" />
            </div>
        </div>
    );
};
