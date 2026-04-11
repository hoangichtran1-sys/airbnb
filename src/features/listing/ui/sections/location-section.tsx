import { Heading } from "@/components/heading";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { RentFormValues } from "../components/rent-modal";
import { STEPS } from "@/enums/steps";
import { cn } from "@/lib/utils";
import { CountrySelect } from "../components/country-select";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const Map = dynamic(() => import("../components/map").then((mod) => mod.Map), {
    ssr: false,
    loading: () => {
        <Skeleton className="w-full h-auto" />;
    },
});

interface LocationSectionProps {
    step: STEPS;
}

export const LocationSection = ({ step }: LocationSectionProps) => {
    const { control, watch } = useFormContext<RentFormValues>();
    const location = watch("location");

    return (
        <div
            className={cn(
                "flex flex-col gap-8",
                step !== STEPS.LOCATION && "hidden"
            )}
        >
            <Heading
                title="Where is your place located?"
                subtitle="Help guests find you!"
            />
            <FormField
                control={control}
                name="location"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <CountrySelect
                                onChange={(country) => field.onChange(country)}
                                value={field.value}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {step === STEPS.LOCATION && <Map center={location?.latlng} />}
        </div>
    );
};
