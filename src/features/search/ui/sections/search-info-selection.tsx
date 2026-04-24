import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { SEARCH_STEPS } from "@/enums/steps";
import { Counter } from "@/features/listing/ui/components/counter";
import { cn } from "@/lib/utils";

interface SearchInfoSectionProps {
    step: SEARCH_STEPS;
    guestCount: number;
    setGuestCount: (value: number) => void;
    roomCount: number;
    setRoomCount: (value: number) => void;
    bathroomCount: number;
    setBathroomCount: (value: number) => void;
    bedroomCount: number;
    setBedroomCount: (value: number) => void;
}

export const SearchInfoSection = ({
    step,
    guestCount,
    setGuestCount,
    roomCount,
    setRoomCount,
    bathroomCount,
    setBathroomCount,
    bedroomCount,
    setBedroomCount
}: SearchInfoSectionProps) => {
    return (
        <div
            className={cn(
                "flex flex-col gap-8",
                step !== SEARCH_STEPS.INFO && "hidden",
            )}
        >
            <Heading
                title="More information"
                subtitle="Find your perfect place!"
            />
            <Counter
                title="Guests"
                subtitle="How many guests are coming?"
                value={guestCount}
                onChange={setGuestCount}
            />
            <Separator />
            <Counter
                title="Rooms"
                subtitle="How many room do you need?"
                value={roomCount}
                onChange={setRoomCount}
            />
            <Separator />
            <Counter
                title="Bathrooms"
                subtitle="How many bathroom do you need?"
                value={bathroomCount}
                onChange={setBathroomCount}
            />
            <Separator />
            <Counter
                title="Bedrooms"
                subtitle="How many bedroom do you need?"
                value={bedroomCount}
                onChange={setBedroomCount}
            />
        </div>
    );
};
