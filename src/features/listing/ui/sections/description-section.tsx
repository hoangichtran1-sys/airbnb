import { Heading } from "@/components/heading";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { RentFormValues } from "../components/rent-modal";
import { STEPS } from "@/enums/steps";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionSectionProps {
    step: STEPS;
}

export const DescriptionSection = ({ step }: DescriptionSectionProps) => {
    const { control } = useFormContext<RentFormValues>();

    return (
        <div
            className={cn(
                "flex flex-col gap-8",
                step !== STEPS.DESCRIPTION && "hidden",
            )}
        >
            <Heading
                title="How would you describe your place?"
                subtitle="Short and sweet works best!"
            />
            <FormField
                control={control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. My House" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Separator />
            <FormField
                control={control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="e.g. It's spacious, airy, and absolutely beautiful."
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
