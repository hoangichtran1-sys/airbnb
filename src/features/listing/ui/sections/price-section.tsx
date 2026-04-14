import { Heading } from "@/components/heading";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { RentFormValues } from "../components/rent-modal";
import { RENT_STEPS } from "@/enums/steps";
import { cn, formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface PriceSectionProps {
    step: RENT_STEPS;
}

export const PriceSection = ({ step }: PriceSectionProps) => {
    const { control, watch } = useFormContext<RentFormValues>();
    const price = watch("price");

    return (
        <div
            className={cn(
                "flex flex-col gap-8",
                step !== RENT_STEPS.PRICE && "hidden",
            )}
        >
            <Heading
                title={`Now, set your price: ${formatPrice(price)}`}
                subtitle="How much do you charge per night?"
            />
            <FormField
                control={control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input
                                type="number"
                                min={1}
                                step={0.01}
                                placeholder="Set a price for your place"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};
