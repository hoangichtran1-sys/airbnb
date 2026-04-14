"use client";

import { useCountries } from "@/features/listing/hooks/use-countries";
import { useListingsSearch } from "@/features/search/hooks/use-listings-search";
import { useSearchModal } from "@/features/search/hooks/use-rent-modal";
import { BiSearch } from "react-icons/bi";
import { differenceInDays } from "date-fns";
import { useMemo } from "react";

export const Search = () => {
    const { onOpenSearchModal } = useSearchModal();

    const [searchValues] = useListingsSearch();

    const { getByValue } = useCountries();

    const locationLabel = useMemo(() => {
        if (searchValues.locationValue) {
            return getByValue(searchValues.locationValue)?.label as string;
        }

        return "Anywhere";
    }, [searchValues.locationValue, getByValue]);

    const durationLabel = useMemo(() => {
        if (searchValues.startDate && searchValues.endDate) {
            const start = searchValues.startDate;
            const end = searchValues.endDate;
            let diff = differenceInDays(end, start);

            if (diff === 0) {
                diff = 1;
            }

            return `${diff} ${diff === 1 ? "Day" : "Days"}`;
        }

        return "Any Week";
    }, [searchValues.startDate, searchValues.endDate]);

    return (
        <div
            onClick={onOpenSearchModal}
            className="border w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-sm transition cursor-pointer"
        >
            <div className="flex flex-row items-center justify-between">
                <div className="text-sm font-semibold px-6">
                    {locationLabel}
                </div>
                <div className="hidden sm:block text-sm font-semibold px-6 border-x flex-1 text-center">
                    {durationLabel}
                </div>
                <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3">
                    <div className="hidden sm:block">
                        {searchValues.guestCount
                            ? searchValues.guestCount
                            : "Add Guests"}
                    </div>
                    <div className="p-2 bg-rose-500  rounded-full text-white">
                        <BiSearch size={18} />
                    </div>
                </div>
            </div>
        </div>
    );
};
