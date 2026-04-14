"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useRentModal } from "../../hooks/use-rent-modal";
import { useState } from "react";
import { RENT_STEPS } from "@/enums/steps";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useCreateListing } from "../../api/use-create-listing";
import { toast } from "sonner";
import { CategorySection } from "../sections/category-section";
import { LocationSection } from "../sections/location-section";
import { InfoSection } from "../sections/info-section";
import { ImageUploadSection } from "../sections/image-upload-section";
import { DescriptionSection } from "../sections/description-section";
import { PriceSection } from "../sections/price-section";
import { rentSchema } from "../../schemas";

export type RentFormValues = z.infer<typeof rentSchema>;

const fieldsByStep: Record<number, (keyof RentFormValues)[]> = {
    [RENT_STEPS.CATEGORY]: ["category"],
    [RENT_STEPS.LOCATION]: ["location"],
    [RENT_STEPS.INFO]: ["guestCount", "roomCount", "bathroomCount"],
    [RENT_STEPS.IMAGES]: ["imageUrl"],
    [RENT_STEPS.DESCRIPTION]: ["title", "description"],
    [RENT_STEPS.PRICE]: ["price"],
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

    const [step, setStep] = useState(RENT_STEPS.CATEGORY);

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
                    setStep(RENT_STEPS.CATEGORY);
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
                    <div className="mt-8 flex flex-col md:flex-row gap-3">
                        <Button
                            key="back-btn"
                            type="button"
                            onClick={onBack}
                            variant="outline"
                            className="w-full md:w-1/2"
                            disabled={step === RENT_STEPS.CATEGORY}
                        >
                            Back
                        </Button>
                        {step !== RENT_STEPS.PRICE ? (
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
