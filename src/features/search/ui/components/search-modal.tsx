"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useSearchModal } from "../../hooks/use-rent-modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Range } from "react-date-range";
import { CountrySelectValue } from "@/features/listing/types";
import { useListingsSearch } from "../../hooks/use-listings-search";
import { SEARCH_STEPS } from "@/enums/steps";
import { SearchLocationSection } from "../sections/search-location-sections";
import { SearchDateSection } from "../sections/search-date-sections";
import { SearchInfoSection } from "../sections/search-info-selection";

export const SearchModal = () => {
    const { openSearchModal, setOpenSearchModal, onCloseSearchModal } =
        useSearchModal();

    const [step, setStep] = useState(SEARCH_STEPS.LOCATION);
    const [location, setLocation] = useState<CountrySelectValue>();
    const [guestCount, setGuestCount] = useState(1);
    const [roomCount, setRoomCount] = useState(1);
    const [bathroomCount, setBathroomCount] = useState(1);
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
    });

    const [searchValues, setSearchValues] = useListingsSearch();

    const onBack = () => {
        setStep((value) => value - 1);
    };

    const onNext = () => {
        setStep((value) => value + 1);
    };

    const onSubmit = () => {
        if (step !== SEARCH_STEPS.INFO) {
            return onNext();
        }

        setSearchValues({
            ...searchValues,
            locationValue: location?.value,
            guestCount,
            roomCount,
            bathroomCount,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
        });

        setStep(SEARCH_STEPS.LOCATION);
        onCloseSearchModal();
    };

    return (
        <ResponsiveModal
            open={openSearchModal}
            onOpenChange={setOpenSearchModal}
            title="Listings filters"
        >
            <SearchLocationSection
                step={step}
                location={location}
                setLocation={setLocation}
            />
            <SearchDateSection
                step={step}
                dateRange={dateRange}
                setDateRange={setDateRange}
            />
            <SearchInfoSection
                step={step}
                guestCount={guestCount}
                roomCount={roomCount}
                bathroomCount={bathroomCount}
                setGuestCount={setGuestCount}
                setRoomCount={setRoomCount}
                setBathroomCount={setBathroomCount}
            />
            <div className="mt-8 flex flex-col md:flex-row gap-3">
                <Button
                    key="back-button"
                    onClick={onBack}
                    variant="outline"
                    className="w-full md:w-1/2"
                    disabled={step === SEARCH_STEPS.LOCATION}
                >
                    Back
                </Button>
                {step === SEARCH_STEPS.INFO ? (
                    <Button
                        variant="tertiary"
                        key="search-button"
                        onClick={onSubmit}
                        className="w-full md:w-1/2"
                    >
                        Search
                    </Button>
                ) : (
                    <Button
                        variant="tertiary"
                        key="next-button"
                        onClick={onSubmit}
                        className="w-full md:w-1/2"
                    >
                        Next
                    </Button>
                )}
            </div>
        </ResponsiveModal>
    );
};
