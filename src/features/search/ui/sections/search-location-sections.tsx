import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { SEARCH_STEPS } from "@/enums/steps";
import { CountrySelectValue } from "@/features/listing/types";
import { CountrySelect } from "@/features/listing/ui/components/country-select";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const Map = dynamic(
    () => import("@/features/listing/ui/components/map").then((mod) => mod.Map),
    {
        ssr: false,
        loading: () => <Skeleton className="w-full h-auto" />,
    },
);

interface SearchLocationSectionProps {
    step: SEARCH_STEPS;
    location: CountrySelectValue | undefined;
    setLocation: (value: CountrySelectValue | undefined) => void;
}

export const SearchLocationSection = ({
    step,
    location,
    setLocation,
}: SearchLocationSectionProps) => {
    return (
        <div
            className={cn(
                "flex flex-col gap-8",
                step !== SEARCH_STEPS.LOCATION && "hidden",
            )}
        >
            <Heading
                title="Where do you wanna go?"
                subtitle="Find the perfect location"
            />
            <CountrySelect value={location} onChange={setLocation} />
            <Separator />
            {step === SEARCH_STEPS.LOCATION && (
                <Map center={location?.latlng} />
            )}
        </div>
    );
};
