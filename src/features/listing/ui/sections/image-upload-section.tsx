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
import { cn } from "@/lib/utils";
import { ImageUploader } from "../components/image-uploader";

interface ImageUploadSectionProps {
    step: RENT_STEPS;
}

export const ImageUploadSection = ({ step }: ImageUploadSectionProps) => {
    const { control } = useFormContext<RentFormValues>();

    return (
        <div
            className={cn(
                "flex flex-col gap-8",
                step !== RENT_STEPS.IMAGES && "hidden",
            )}
        >
            <Heading
                title="Add a photo of your place"
                subtitle="Show guests what your place looks like!"
            />
            <FormField
                control={control}
                name="imageUrl"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <ImageUploader
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
