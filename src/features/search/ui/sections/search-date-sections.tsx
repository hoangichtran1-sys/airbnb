import { Heading } from "@/components/heading";
import { SEARCH_STEPS } from "@/enums/steps";
import { Calendar } from "@/features/listing/ui/components/calendar";
import { cn } from "@/lib/utils";
import { Range } from "react-date-range";

interface SearchDateSectionProps {
    step: SEARCH_STEPS;
    dateRange: Range;
    setDateRange: (value: Range) => void;
}

export const SearchDateSection = ({
    step,
    dateRange,
    setDateRange,
}: SearchDateSectionProps) => {
    return (
        <div
            className={cn(
                "flex flex-col gap-8",
                step !== SEARCH_STEPS.DATE && "hidden",
            )}
        >
            <Heading
                title="When do you plan to go?"
                subtitle="Make sure everyone is free!"
            />
            <Calendar
                value={dateRange}
                onChange={(value) => setDateRange(value.selection)}
            />
        </div>
    );
};
