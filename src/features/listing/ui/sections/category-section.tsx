import { Heading } from "@/components/heading";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { RentFormValues } from "../components/rent-modal";
import { categories } from "@/features/categories/ui/components/category-list";
import { CategoryInput } from "@/features/categories/ui/components/category-input";
import { RENT_STEPS } from "@/enums/steps";
import { cn } from "@/lib/utils";

interface CategorySectionProps {
    step: RENT_STEPS;
}

export const CategorySection = ({ step }: CategorySectionProps) => {
    const { control } = useFormContext<RentFormValues>();

    return (
        <div
            className={cn(
                "flex flex-col gap-8",
                step !== RENT_STEPS.CATEGORY && "hidden",
            )}
        >
            <Heading
                title="Which of these best describes your place?"
                subtitle="Pick a category"
            />
            <FormField
                control={control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
                                {categories.map((item) => (
                                    <div
                                        key={item.label}
                                        className="col-span-1"
                                    >
                                        <CategoryInput
                                            onSelect={(category) =>
                                                field.onChange(category)
                                            }
                                            selected={
                                                field.value === item.label
                                            }
                                            label={item.label}
                                            icon={item.icon}
                                        />
                                    </div>
                                ))}
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};
