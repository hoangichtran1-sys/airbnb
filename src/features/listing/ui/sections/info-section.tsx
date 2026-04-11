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
import { Counter } from "../components/counter";
import { Separator } from "@/components/ui/separator";

interface InfoSectionProps {
    step: STEPS;
}

export const InfoSection = ({ step }: InfoSectionProps) => {
    const { control } = useFormContext<RentFormValues>();

    return (
        <div
            className={cn(
                "flex flex-col gap-8",
                step !== STEPS.INFO && "hidden",
            )}
        >
            <Heading
                title="Share some basics about your place"
                subtitle="What amenities do you have?"
            />
            <FormField
                control={control}
                name="guestCount"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Counter
                                title="Guests"
                                subtitle="How many guests do you allow?"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Separator />
            <FormField
                control={control}
                name="roomCount"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Counter
                                title="Rooms"
                                subtitle="How many rooms do you have?"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Separator />
            <FormField
                control={control}
                name="bathroomCount"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Counter
                                title="Bathrooms"
                                subtitle="How many bathrooms dou you have?"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};
