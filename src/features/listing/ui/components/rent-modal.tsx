"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useRentModal } from "../../hooks/use-rent-modal";
import { useState } from "react";
import { STEPS } from "@/enums/steps";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { CountrySelectValue } from "../../types";
import { useCreateListing } from "../../api/use-create-listing";
import { toast } from "sonner";
import { CategorySection } from "../sections/category-section";
import { LocationSection } from "../sections/location-section";
import { InfoSection } from "../sections/info-section";
import { ImageUploadSection } from "../sections/image-upload-section";
import { DescriptionSection } from "../sections/description-section";
import { PriceSection } from "../sections/price-section";

const rentSchema = z.object({
    category: z.string().min(1, "Category is required"),
    location: z.custom<CountrySelectValue>().nullable(),
    guestCount: z.number().int().min(1),
    roomCount: z.number().int().min(1),
    bathroomCount: z.number().int().min(1),
    imageUrl: z.string().min(1, "Image URL is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number().min(1),
});

export type RentFormValues = z.infer<typeof rentSchema>;

const fieldsByStep: Record<number, (keyof RentFormValues)[]> = {
    [STEPS.CATEGORY]: ["category"],
    [STEPS.LOCATION]: ["location"],
    [STEPS.INFO]: ["guestCount", "roomCount", "bathroomCount"],
    [STEPS.IMAGES]: ["imageUrl"],
    [STEPS.DESCRIPTION]: ["title", "description"],
    [STEPS.PRICE]: ["price"],
};

export const RentModal = () => {
    const { openRentModal, setOpenRentModal, onCloseRentModal } =
        useRentModal();

    const form = useForm<RentFormValues>({
        resolver: zodResolver(rentSchema),
        defaultValues: {
            category: "",
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageUrl: "",
            title: "",
            description: "",
            price: 1,
        },
        shouldUnregister: false,
    });

    const [step, setStep] = useState(STEPS.CATEGORY);

    const createListing = useCreateListing();

    const onBack = () => {
        setStep((value) => value - 1);
    };

    const onNext = async () => {
        const fieldsToValidate = fieldsByStep[step];

        const isValid = await form.trigger(fieldsToValidate);

        if (isValid) {
            setStep((value) => value + 1);
        }
    };

    const handleSubmit = async (values: RentFormValues) => {
        if (!values.location?.value) {
            toast.warning("You need to select a specific location on the map");
            return;
        }

        createListing.mutate(
            {
                ...values,
                location: values.location.value,
            },
            {
                onSuccess: () => {
                    form.reset();
                    setStep(STEPS.CATEGORY);
                    onCloseRentModal();
                },
            },
        );
    };

    return (
        <ResponsiveModal
            title="Airbnb your home!"
            open={openRentModal}
            onOpenChange={setOpenRentModal}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <CategorySection step={step} />
                    <LocationSection step={step} />
                    <InfoSection step={step} />
                    <ImageUploadSection step={step} />
                    <DescriptionSection step={step} />
                    <PriceSection step={step} />
                    <div className="mt-8 flex flex-col  md:flex-row gap-3">
                        <Button
                            type="button"
                            onClick={onBack}
                            variant="outline"
                            className="w-full md:w-1/2"
                            disabled={step === STEPS.CATEGORY}
                        >
                            Back
                        </Button>
                        {step !== STEPS.PRICE ? (
                            <Button
                                key="next-btn"
                                type="button"
                                onClick={onNext}
                                variant="tertiary"
                                className="w-full md:w-1/2"
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                key="create-btn"
                                type="submit"
                                variant="tertiary"
                                className="w-full md:w-1/2"
                                disabled={createListing.isPending}
                            >
                                Create
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </ResponsiveModal>
    );
};
