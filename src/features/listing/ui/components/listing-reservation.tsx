import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { Range } from "react-date-range";
import { Calendar } from "./calendar";
import { Button } from "@/components/ui/button";

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
